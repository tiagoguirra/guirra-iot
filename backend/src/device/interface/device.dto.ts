import { DeviceValue } from '../dto/device-property.dto'

export interface DeviceInitialState {
  property: string
  value: DeviceValue | DeviceValue[]
}
export interface DeviceSettings {
  pulse: number
  initialState: DeviceInitialState[]
}
