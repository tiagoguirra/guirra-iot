export interface OauthCodeDto {
  code_id: string
  code: string
  client_id: string
  expires_in: number
  created_at: Date
  scopes: string[]
}
