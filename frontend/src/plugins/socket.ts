import SocketIO from 'socket.io-client'
import { resolveToken } from '../services/api'
import * as _ from 'lodash'
import { DEVICE_STATUS } from '@/store/actions/device'

const websocket = {
  install(Vue: any, store: any) {
    Vue.prototype.$socket = null
    resolveToken()
      .then(async token => {
        if (token) {
          Vue.prototype.$socketConnect(token)
        }
      })
      .catch(err => console.log(err))
    Vue.prototype.$socketConnect = function(authorization: string) {
      Vue.prototype.$socket = SocketIO(process.env.VUE_APP_WS + '/events', {
        query: {
          authorization: 'Bearer ' + authorization,
        },
      })
      Vue.prototype.$socket.on('device_change', (body: any) => {
        const deviceId = _.get(body, 'device_id')
        if (deviceId) {
          store.dispatch(DEVICE_STATUS, { deviceId: deviceId })
        }
      })
    }
    Vue.prototype.$socketDisconnect = () => {
      if (Vue.prototype.$socket) {
        Vue.prototype.$socket.disconnect()
      }
    }
  },
}
export default websocket
