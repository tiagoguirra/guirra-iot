export interface AlexaTokenDto {
  alexa_token_id: string
  user_id: string
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  code: string
  created_at: Date
}
