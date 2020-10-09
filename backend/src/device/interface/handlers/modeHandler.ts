import { DeviceShadow } from '../../../device-shadow/device-shadow'
import {
  DeviceShadowState,
  DeviceShadowModeState,
  DeviceShadowInitialModeState
} from '../../../device-shadow/device-shadow.dto'
import * as _ from 'lodash'

export class ModeHandler {
  shadow: DeviceShadow
  initial?: string
  mode: string
  values: string[]
  constructor(mode: string, values: string[], shadow: DeviceShadow) {
    this.shadow = shadow
    this.mode = mode
    this.values = values
  }
  async get(): Promise<DeviceShadowModeState> {
    const state: DeviceShadowState = (await this.shadow.getState(
      this.mode
    )) as DeviceShadowState
    return {
      last_report: _.get(state, 'last_report'),
      mode: this.mode,
      timestamp: _.get(state, 'timestamp'),
      value: _.get(state, 'state') as string
    }
  }
  async set(value: string): Promise<void> {
    await this.shadow.updateState(value, this.mode)
  }
  async getInitial(): Promise<DeviceShadowInitialModeState> {
    const settings = await this.shadow.getSettings()
    return {
      mode: this.mode,
      value: _.get(settings, ['initialState', this.mode]) as string
    }
  }
}
