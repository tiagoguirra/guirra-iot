import { Injectable } from '@nestjs/common'
import { OauthClientEntity } from '../entity/oauth-client.entity'
import { Repository, Raw } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as md5 from 'md5'
import { OauthCodeEntity } from '../entity/oauth-code.entity'
import { v4 as uuidv4 } from 'uuid'
import { OauthTokenEntity } from '../entity/oauth-token.entity'
import * as fs from 'fs-extra'
import * as path from 'path'
import { sign, verify } from 'jsonwebtoken'
import { OauthTokenDto } from '../dto/oaut-token.dto'
import { UserService } from 'src/user/service/user.service'
import { compareSync } from 'bcrypt'
import * as moment from 'moment'
import { JwtToken } from '../dto/token.dto'
import * as _ from 'lodash'
import { OauthVerificationDto } from '../dto/oauth-verification.dto'

@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(OauthClientEntity)
    private readonly ClientRepository: Repository<OauthClientEntity>,
    @InjectRepository(OauthCodeEntity)
    private readonly CodeRepository: Repository<OauthCodeEntity>,
    @InjectRepository(OauthTokenEntity)
    private readonly TokenRepository: Repository<OauthTokenEntity>,
    private readonly UserService: UserService
  ) {}
  dialog(clientId: string, redirectUrl: string): Promise<OauthClientEntity> {
    return this.ClientRepository.findOne({
      where: { client_id: clientId, redirect_url: redirectUrl }
    })
  }
  autorize(
    clientId: string,
    userId: string,
    scopes: string[] = []
  ): Promise<OauthCodeEntity> {
    const randomString = (Math.random() * 10000000).toString(36)
    const code = md5(randomString.replace('.', ''))
    const oauthCode = this.CodeRepository.create({
      client_id: clientId,
      code,
      expires_in: 86400,
      scopes,
      user_id: userId
    })
    return this.CodeRepository.save(oauthCode)
  }
  async autorizationCode(
    clientId: string,
    verification: string,
    code: string
  ): Promise<OauthTokenDto> {
    const oauthCode = await this.CodeRepository.findOne({
      where: {
        client_id: clientId,
        code
      },
      relations: ['client']
    })
    if (
      oauthCode &&
      oauthCode.client &&
      (oauthCode.client.redirect_url === verification ||
        oauthCode.client.client_secret === verification)
    ) {
      const token = uuidv4()
      const refreshToken = uuidv4()
      const tokenRecipient = this.TokenRepository.create({
        expires_in: 3600,
        refresh_token: refreshToken,
        token,
        token_type: 'Bearer',
        code_id: oauthCode.code_id
      })
      const tokenSaves = await this.TokenRepository.save(tokenRecipient)
      return this.generateTokens(
        tokenSaves.token,
        tokenSaves.refresh_token,
        tokenSaves.expires_in,
        oauthCode.user_id,
        oauthCode.scopes || []
      )
    }
    return null
  }
  async autorizationPassword(
    clientId: string,
    clientSecret: string,
    username: string,
    password: string,
    scope?: string[]
  ) {
    const client = await this.ClientRepository.findOne({
      client_id: clientId,
      client_secret: clientSecret,
      type: 'password'
    })
    const user = await this.UserService.findByEmail(username)
    if (user && client && compareSync(password, user.password)) {
      const code = await this.autorize(clientId, user.user_id, scope)
      const tokens = await this.autorizationCode(
        clientId,
        client.redirect_url,
        code.code
      )
      return tokens
    }
  }

  async autorizationRefreshToken(
    clientId: string,
    clientCheck: string,
    refreshToken: string
  ) {
    const payload: JwtToken = verify(refreshToken, this.publicCertificate(), {
      algorithms: ['RS256']
    }) as JwtToken
    if (payload.type === 'refresh_token') {
      const token = await this.TokenRepository.findOne({
        refresh_token: payload.token
      })
      if (token) {
        const oldCode = await this.CodeRepository.findOne({
          where: {
            code_id: token.code_id
          },
          relations: ['client']
        })
        if (
          oldCode &&
          oldCode.client &&
          oldCode.client.client_id === clientId 
        ) {
          const code = await this.autorize(
            clientId,
            payload.user_id,
            oldCode.scopes
          )
          const tokens = await this.autorizationCode(
            clientId,
            oldCode.client.redirect_url,
            code.code
          )
          return tokens
        }
      }
    }
    return null
  }
  private publicCertificate(): string {
    const certPath = path.resolve(__dirname, '..', 'key', 'jwtRS256.key.pub')
    if (fs.existsSync(certPath)) {
      return fs.readFileSync(certPath).toString()
    }
    throw new Error('Authentication certificate not found')
  }
  private privateCertificate(): string {
    const certPath = path.resolve(__dirname, '..', 'key', 'jwtRS256.key')
    if (fs.existsSync(certPath)) {
      return fs.readFileSync(certPath).toString()
    }
    throw new Error('Authentication certificate not found')
  }
  private generateTokens(
    token: string,
    refreshToken: string,
    expiresIn: number,
    userId: string,
    scope: string[]
  ): OauthTokenDto {
    const cert = this.privateCertificate()
    const jwtToken = sign(
      {
        type: 'token',
        token,
        createdAt: new Date().toISOString(),
        user_id: userId
      },
      cert,
      {
        algorithm: 'RS256',
        expiresIn
      }
    )
    const jwtRefreshToken = sign(
      {
        type: 'refresh_token',
        token: refreshToken,
        createdAt: new Date().toISOString(),
        user_id: userId
      },
      cert,
      {
        algorithm: 'RS256'
      }
    )
    return {
      access_token: jwtToken,
      refresh_token: jwtRefreshToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      scope
    }
  }
  async login(email: string, password: string) {
    const user = await this.UserService.findByEmail(email)
    if (user && compareSync(password, user.password)) {
      const client = await this.ClientRepository.findOne({
        where: { default: Raw(alias => `${alias}`), type: 'password' }
      })
      if (client) {
        const code = await this.autorize(client.client_id, user.user_id, ['*'])
        const tokens = await this.autorizationCode(
          client.client_id,
          client.client_secret,
          code.code
        )
        return tokens
      }
    }
    return null
  }
  async loginRefresh(refreshToken: string) {
    const payload: JwtToken = verify(refreshToken, this.publicCertificate(), {
      algorithms: ['RS256']
    }) as JwtToken
    if (payload.type === 'refresh_token') {
      const token = await this.TokenRepository.findOne({
        refresh_token: payload.token
      })
      const client = await this.ClientRepository.findOne({
        where: { default: Raw(alias => `${alias}`), type: 'password' }
      })
      if (token) {
        const oldCode = await this.CodeRepository.findOne({
          where: {
            code_id: token.code_id
          },
          relations: ['client']
        })
        if (
          oldCode &&
          oldCode.client &&
          oldCode.client.client_id === client.client_id &&
          oldCode.client.client_secret === client.client_secret
        ) {
          const code = await this.autorize(
            client.client_id,
            payload.user_id,
            oldCode.scopes
          )
          const tokens = await this.autorizationCode(
            client.client_id,
            oldCode.client.redirect_url,
            code.code
          )
          return tokens
        }
      }
    }
    return null
  }
  async verify(tokenBearer: string): Promise<OauthVerificationDto | null> {
    const splitCode = tokenBearer.split(' ')
    const clearToken = _.get(splitCode, '1', '')
    if (_.get(splitCode, '0', '').toLocaleLowerCase() !== 'bearer') {
      return null
    }
    const payload: JwtToken = verify(clearToken, this.publicCertificate(), {
      algorithms: ['RS256']
    }) as JwtToken

    if (payload.type === 'token') {
      const token = await this.TokenRepository.findOne({
        where: { token: payload.token },
        relations: ['code']
      })
      if (token) {
        const dateExpires = moment(token.created_at).add(
          token.expires_in,
          'seconds'
        )
        const now = moment()
        if (dateExpires > now) {
          const user = await this.UserService.findById(payload.user_id)
          return {
            user: user.toJson(),
            scopes: _.get(token, ['code', 'scopes'], [])
          }
        }
      }
    }
    return null
  }
}
