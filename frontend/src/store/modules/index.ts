import auth, { AuthState } from './auth'
import errors from './errors'
import device, { DeviceState } from './device'
export interface AppStore {
  auth: AuthState
  errors: any
  device: DeviceState
}

export default {
  auth,
  errors,
  device,
}
