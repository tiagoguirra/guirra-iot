import { DeviceValue } from '../../../device/dto/device-property.dto'

export interface capabilityConstructor {
  proactively?: boolean
  retrievable?: boolean
  initial?: DeviceValue | DeviceValue[]
  uncertainty?: number
}
