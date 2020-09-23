import { Request } from 'express'
import { UserDto } from 'src/user/dto/user.dto'
import { OauthVerificationDto } from '../oauth/dto/oauth-verification.dto'

export interface RequestDto extends Request {
  oauth?: OauthVerificationDto
}
