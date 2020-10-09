import { DeviceValue } from '../device/dto/device-property.dto'

export type DeviceShadowValue = DeviceShadowState | DeviceShadowModeState
export type DeviceShadowInitialValue =
  | DeviceShadowInitialState
  | DeviceShadowInitialModeState

export interface DeviceShadowState {
  property: string
  state: DeviceValue | DeviceValue[]
  delta?: DeviceValue | DeviceValue[]
  last_report: number
  timestamp: number
}

export interface DeviceShadowModeState {
  mode: string
  value: string
  last_report: number
  timestamp: number
}

export interface DeviceShadowInitialState {
  property: string
  value: DeviceValue | DeviceValue[]
}

export interface DeviceShadowInitialModeState {
  mode: string
  value: string
}
export interface DeviceShadowSettings {
  pulse: number
  initialState: {
    [property: string]: DeviceValue | DeviceValue[]
  }
}
