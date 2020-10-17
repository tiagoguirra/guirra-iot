import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common'
import * as _ from 'lodash'
import { Response } from 'express'
import { OauthService } from './service/oauth.service'
import { RequestDto } from '../dto/request.dto'

@Injectable()
export class OauthMiddleware implements NestMiddleware {
  constructor(private readonly OauthService: OauthService) {}
  async use(req: RequestDto, res: Response, next: () => void) {
    try {
      const dontUse = ['/v1/oauth/token','/v1/oauth/login','/v1/oauth/login/refresh']
      if (dontUse.includes(req.originalUrl)) {
        return next()
      }
      const authorization = _.get(req, 'headers.authorization', '')
      if (authorization) {
        const oauthResolve = await this.OauthService.verify(authorization)
        if (oauthResolve) {
          req.oauth = oauthResolve
          return next()
        }
      }
      res.status(HttpStatus.UNAUTHORIZED).json({
        error: [
          {
            message: 'Access denied ',
            code: 401
          }
        ]
      })
    } catch (err) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        error: [
          {
            message: 'Access denied ',
            code: 401
          },
          {
            message: _.get(err, 'message', ''),
            code: _.get(err, 'code', '')
          }
        ]
      })
    }
  }
}
