import { ERRORS_SHOW } from '../actions/errors'
import { AUTH_LOGOUT } from '../actions/auth'
import Vue from 'vue'
import * as _ from 'lodash'
import router from '../../router'

const state = {}
const getters = {}

const actions = {
  [ERRORS_SHOW]: ({ dispatch }: any, errors: any) => {
    if (errors != null && _.get(errors, 'response.data', null) != null) {
      const status = _.get(errors, 'response.status', null)
      const errosAlert = _.get(errors, 'response.data.error')
      switch (status) {
        case 401:
        case 403:
          Vue.toasted.show(
            _.get(errors, 'response.data.message', 'Access denied'),
            {
              type: 'error',
            }
          )
          dispatch(AUTH_LOGOUT)
          router.replace({ path: '/login' })
          break
        default:
          if (Array.isArray(errosAlert)) {
            errosAlert.forEach(msg =>
              Vue.toasted.show(_.get(msg, 'message', _.get(msg, 'code', '')), {
                type: 'error',
              })
            )
          } else {
            Vue.toasted.show(
              _.get(errosAlert, 'message', _.get(errosAlert, 'code', '')),
              {
                type: 'error',
              }
            )
          }
          break
      }
    } else {
      Vue.toasted.show('Erro na aplicação', {
        type: 'error',
      })
    }
  },
}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations,
}
