import {
  Controller,
  Post,
  Get,
  Res,
  HttpStatus,
  Body,
  Query
} from '@nestjs/common'
import { OauthService } from '../../oauth/service/oauth.service'
import { Response } from 'express'
import * as _ from 'lodash'
import { UserContext } from 'src/oauth/decorator/user.decorator'

@Controller('v1/oauth')
export class OauthController {
  constructor(private readonly OauthService: OauthService) {}

  @Get('/dialog')
  async dialog(
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUrl: string,
    @Res() res: Response
  ) {
    try {
      const client = await this.OauthService.dialog(clientId, redirectUrl)
      if (client) {
        return res.status(HttpStatus.OK).json(client.toJson())
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: [
          {
            message: 'Paramter to client inválid',
            code: 400
          }
        ]
      })
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: [
          {
            message: _.get(err, 'message', 'Interal server error'),
            code: _.get(err, 'code', '')
          }
        ]
      })
    }
  }

  @Post('/autorize')
  async autorize(
    @Body('client_id') clientId: string,
    @Body('scopes') scopes: string[],
    @Body('redirect_uri') redirectUrl: string,
    @UserContext('user_id') userId: string,
    @Res() res: Response
  ) {
    try {
      const code = await this.OauthService.autorize(clientId, userId, scopes)
      return res.status(HttpStatus.OK).json({
        ...code.toJson(),
        redirect_url: redirectUrl
      })
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: [
          {
            message: _.get(err, 'message', 'Interal server error'),
            code: _.get(err, 'code', '')
          }
        ]
      })
    }
  }

  @Post('/token')
  async token(
    @Body('code') code: string,
    @Body('refresh_token') refreshToken: string,
    @Body('grant_type') grant: string,
    @Body('client_id') clientId: string,
    @Body('redirect_uri') redirectUri: string,
    @Body('client_secret') clientSecret: string,
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('scope') scope: string[],
    @Res() res: Response
  ) {
    try {
      let tokens = null
      if (grant === 'authorization_code') {
        tokens = await this.OauthService.autorizationCode(
          clientId,
          redirectUri || clientSecret,
          code
        )
      } else if (grant === 'refresh_token') {
        tokens = await this.OauthService.autorizationRefreshToken(
          clientId,
          redirectUri || clientSecret,
          refreshToken
        )
      } else if (grant === 'password') {
        tokens = await this.OauthService.autorizationPassword(
          clientId,
          clientSecret,
          username,
          password,
          scope
        )
      }
      if (!tokens) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: [
            {
              message: 'Access denied ',
              code: 401
            }
          ]
        })
      }
      return res.status(HttpStatus.OK).json({
        access_token: tokens.access_token,
        token_type: 'bearer',
        expires_in: tokens.expires_in,
        refresh_token: tokens.refresh_token,
        scope: (tokens.scopes || []).join(' ')
      })
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: [
          {
            message: _.get(err, 'message', 'Interal server error'),
            code: _.get(err, 'code', '')
          }
        ]
      })
    }
  }

  @Post('/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response
  ) {
    try {
      const tokens = await this.OauthService.login(email, password)
      if (tokens) {
        return res.json(tokens)
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: [
            {
              message: 'Access denied ',
              code: 401
            }
          ]
        })
      }
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: [
          {
            message: _.get(err, 'message', 'Interal server error'),
            code: _.get(err, 'code', '')
          }
        ]
      })
    }
  }
  @Post('/login/refresh')
  async loginRefreash(
    @Body('refresh_token') refreshToken: string,
    @Res() res: Response
  ) {
    try {
      const tokens = await this.OauthService.loginRefresh(refreshToken)
      if (tokens) {
        return res.json(tokens)
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: [
            {
              message: 'Access denied ',
              code: 401
            }
          ]
        })
      }
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: [
          {
            message: _.get(err, 'message', 'Interal server error'),
            code: _.get(err, 'code', '')
          }
        ]
      })
    }
  }
}
