import axios from 'axios'
import * as _ from 'lodash'
const api = axios.create({
  baseURL: process.env.VUE_APP_API || undefined,
})

export const resolveToken = async () => {
  try {
    const token = JSON.parse(window.localStorage.getItem('auth_user') || '')
    return _.get(token, 'access_token', '')
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
