import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { AlexaTokenEntity } from '../entity/alexa-token.entity'
import axios from 'axios'
import * as _ from 'lodash'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AlexaAuthorizationService {
  constructor(
    @InjectRepository(AlexaTokenEntity)
    private readonly AlexaTokenRepository: Repository<AlexaTokenEntity>
  ) {}

  async create(code: string, userId: string): Promise<AlexaTokenEntity> {
    const tokens = await axios.post('https://api.amazon.com/auth/o2/token', {
      grant_type: 'authorization_code',
      code,
      client_id: process.env.ALEXA_CLIENT_ID,
      client_secret: process.env.ALEXA_CLIENT_SECRET
    })
    const token = this.AlexaTokenRepository.create({
      code,
      access_token: _.get(tokens, 'data.access_token'),
      refresh_token: _.get(tokens, 'data.refresh_token'),
      expires_in: _.get(tokens, 'data.expires_in'),
      token_type: _.get(tokens, 'data.token_type'),
      user_id: userId
    })
    return await this.AlexaTokenRepository.save(token)
  }
  async update(token: AlexaTokenEntity): Promise<AlexaTokenEntity> {
    const response = await axios.post('https://api.amazon.com/auth/o2/token', {
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
      client_id: process.env.ALEXA_CLIENT_ID,
      client_secret: process.env.ALEXA_CLIENT_SECRET
    })
    token.access_token = _.get(response, 'data.access_token')
    token.refresh_token = _.get(response, 'data.refresh_token')
    token.expires_in = _.get(response, 'data.expires_in')
    return await this.AlexaTokenRepository.save(token)
  }
  findByUserId(userId: string): Promise<AlexaTokenEntity> {
    return this.AlexaTokenRepository.findOne({
      where: { user_id: userId },
      order: {
        created_at: 'DESC'
      }
    })
  }

  async getCredentials(userId: string) {
    const tokens = await this.findByUserId(userId)
    if (tokens) {
      if (tokens.isValid()) {
        return tokens.toJson()
      } else {
        const newToken = await this.update(tokens)
        return newToken.toJson()
      }
    }
    return null
  }
}
