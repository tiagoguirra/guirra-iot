import {
  AUTH_DIALOG,
  AUTH_AUTORIZE,
  AUTH_LOGOUT,
  AUTH_LOGIN,
  AUTH_REFRESH,
} from '../actions/auth'
import { ERRORS_SHOW } from '../actions/errors'
import * as _ from 'lodash'
import { Dispatch, Commit } from 'vuex'
import api from '../../services/api'
import Vue from 'vue'
import router from '../../router'
export interface AuthState {
  access_token: string | null
  refresh_token: string | null
  expires_in: number
  created_at: Date | null
}

const savedToken = (): AuthState => {
  try {
    const {
      access_token = null,
      refresh_token = null,
      expires_in = 0,
      created_at = null,
    } = JSON.parse(window.localStorage.getItem('auth_user') || '')
    return {
      access_token,
      refresh_token,
      expires_in,
      created_at,
    }
  } catch {
    return {
      access_token: null,
      refresh_token: null,
      expires_in: 0,
      created_at: null,
    }
  }
}
const state: AuthState = savedToken()
const getters = {
  isAuthenticated: (state: AuthState) => !!state.access_token,
  getRefreshToken: (state: AuthState) => state.refresh_token || '',
}

const actions = {
  [AUTH_DIALOG]: (
    { dispatch }: { dispatch: Dispatch },
    { client_id, redirect_uri }: { client_id: string; redirect_uri: string }
  ) => {
    return new Promise((resolve, reject) => {
      api
        .get('/v1/oauth/dialog', {
          params: { client_id, redirect_uri },
        })
        .then(resp => {
          resolve(_.get(resp, 'data'))
        })
        .catch(err => {
          reject(err)
          dispatch(ERRORS_SHOW, err)
        })
    })
  },
  [AUTH_AUTORIZE]: (
    { dispatch }: { dispatch: Dispatch },
    {
      client_id,
      redirect_uri,
      scopes = [],
    }: { client_id: string; redirect_uri: string; scopes: string[] }
  ) => {
    return new Promise((resolve, reject) => {
      api
        .post('/v1/oauth/autorize', {
          client_id,
          redirect_uri,
          scopes,
        })
        .then(resp => {
          resolve(_.get(resp, 'data'))
        })
        .catch(err => {
          reject(err)
          dispatch(ERRORS_SHOW, err)
        })
    })
  },
  [AUTH_LOGIN]: (
    { dispatch, commit }: { dispatch: Dispatch; commit: Commit },
    { email, password }: { email: string; password: string }
  ) => {
    return new Promise((resolve, reject) => {
      api
        .post('/v1/oauth/login', {
          email,
          password,
        })
        .then(resp => {
          commit(AUTH_LOGIN, {
            access_token: _.get(resp, 'data.access_token'),
            refresh_token: _.get(resp, 'data.refresh_token'),
            token_type: _.get(resp, 'data.token_type'),
            expires_in: _.get(resp, 'data.expires_in'),
          })
          Vue.prototype.$socketConnect(_.get(resp, 'data.access_token'))
          resolve(_.get(resp, 'data'))
        })
        .catch(err => {
          reject(err)
          dispatch(ERRORS_SHOW, err)
        })
    })
  },
  [AUTH_LOGOUT]: ({ commit }: { commit: Commit }) => {
    commit(AUTH_LOGOUT)
    Vue.prototype.$socketDisconnect()
    router.replace({ path: '/login' })
  },
  [AUTH_REFRESH]: ({
    commit,
    dispatch,
    getters,
  }: {
    commit: Commit
    dispatch: Dispatch
    getters: any
  }) => {
    if (getters.getRefreshToken) {
      api
        .post('/v1/oauth/login/refresh', {
          refresh_token: getters.getRefreshToken,
        })
        .then(resp => {
          commit(AUTH_LOGIN, {
            access_token: _.get(resp, 'data.access_token'),
            refresh_token: _.get(resp, 'data.refresh_token'),
            token_type: _.get(resp, 'data.token_type'),
            expires_in: _.get(resp, 'data.expires_in'),
          })
          Vue.prototype.$socketConnect(_.get(resp, 'data.access_token'))
          router.replace({ path: '/' })
          Vue.toasted.show('Updated session', {
            type: 'info',
          })
        })
        .catch(() => {
          dispatch(AUTH_LOGOUT)
          Vue.toasted.show('Session expired', {
            type: 'error',
          })
        })
    } else {
      dispatch(AUTH_LOGOUT)
      Vue.toasted.show('Session expired', {
        type: 'error',
      })
    }
  },
}
const mutations = {
  [AUTH_LOGOUT]: (state: AuthState) => {
    window.localStorage.clear()
    state.access_token = null
    state.refresh_token = null
    state.created_at = null
    state.expires_in = 0
  },
  [AUTH_LOGIN]: (
    state: AuthState,
    {
      access_token,
      refresh_token,
      expires_in,
    }: {
      access_token: string | null
      refresh_token: string | null
      expires_in: number
    }
  ) => {
    state.access_token = access_token
    state.refresh_token = refresh_token
    state.created_at = new Date()
    state.expires_in = expires_in
    window.localStorage.setItem(
      'auth_user',
      JSON.stringify({
        access_token,
        refresh_token,
        expires_in,
        created_at: new Date(),
      })
    )
  },
}

export default {
  state,
  actions,
  getters,
  mutations,
}
