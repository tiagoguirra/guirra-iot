import axios from 'axios'
import moment from 'moment'
import * as _ from 'lodash'
const api = axios.create({
  baseURL: process.env.VUE_APP_API || null,
})

export const resolveToken = async () => {
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
      const response = await api.post('/v1/oauth/login/refresh', {
        refresh_token,
      })
      window.localStorage.setItem(
        'auth_user',
        JSON.stringify({
          access_token: _.get(response, 'data.access_token', ''),
          refresh_token: _.get(response, 'data.refresh_token', ''),
          expires_in: _.get(response, 'data.expires_in', ''),
          created_at: new Date(),
        })
      )
      return _.get(response, 'data.access_token', '')
    }
  } catch {
    return null
  }
}

api.interceptors.request.use(
  async function(options) {
    options.headers['Authorization'] = 'Bearer ' + (await resolveToken())
    return options
  },
  function(error) {
    console.log('Request error: ', error)
    return Promise.reject(error)
  }
)

export default api
