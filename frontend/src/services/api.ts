import axios from 'axios'
import moment from 'moment'

const resolveToken = () => {
  try {
    const {
      access_token = null,
      refresh_token = null,
      expires_in = 0,
      created_at = null,
    } = JSON.parse(window.localStorage.getItem('auth_user') || '')
    const now = moment().unix()
    const expireAt = moment(created_at)
      .add(expires_in, 'seconds')
      .unix()
    if (expireAt > now) {
      return access_token
    } else {
      // TODO: Refresh token login
      return ''
    }
  } catch {
    return null
  }
}
const api = axios.create({
  baseURL: process.env.VUE_APP_API || null,
  transformRequest: (data, headers) => {
    headers['authorization'] = resolveToken()
    headers['Content-Type'] = 'application/json'
    return JSON.stringify(data)
  },
})

export default api
