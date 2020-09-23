import auth, { AuthState } from './auth'
import errors from './errors'

export interface AppStore {
  auth: AuthState
  errors: any
}

export default {
  auth,
  errors,
}
