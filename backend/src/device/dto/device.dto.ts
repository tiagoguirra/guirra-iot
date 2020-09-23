import { DeviceProperty } from './device-property.dto'
import { DeviceMode } from './device-mode.dto'

export interface DeviceDto {
  device_id: string
  name: string
  category: string[]
  template: string
  properties: DeviceProperty[]
  modes: DeviceMode[]
  user_id: string
  device_shadow: string
}
