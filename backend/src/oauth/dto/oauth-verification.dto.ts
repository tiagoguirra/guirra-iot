import { UserDto } from '../../user/dto/user.dto'

export interface OauthVerificationDto {
  user: UserDto
  scopes: string[]
}
