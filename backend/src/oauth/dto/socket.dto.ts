import { Socket } from 'socket.io'
import { OauthVerificationDto } from '../../oauth/dto/oauth-verification.dto'

export interface SocketDto extends Socket {
  oauth?: OauthVerificationDto
}
