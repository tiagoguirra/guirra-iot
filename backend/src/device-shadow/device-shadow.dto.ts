import { DeviceValue } from '../device/dto/device-property.dto'

export interface DeviceShadowState {
  property: string
  state: DeviceValue | DeviceValue[]
  delta?: DeviceValue | DeviceValue[]
  last_report: number
  timestamp: number
}

export interface DeviceShadowInitialState {
  property: string
  value: DeviceValue | DeviceValue[]
}
export interface DeviceShadowSettings {
  pulse: number
  initialState: {
    [property: string]: DeviceValue | DeviceValue[]
  }
}
