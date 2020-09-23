import { UserDto } from 'src/user/dto/user.dto'

export interface OauthVerificationDto {
  user: UserDto
  scopes: string[]
}
