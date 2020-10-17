import { Request } from 'express'
import { OauthVerificationDto } from '../oauth/dto/oauth-verification.dto'

export interface RequestDto extends Request {
  oauth?: OauthVerificationDto
}
