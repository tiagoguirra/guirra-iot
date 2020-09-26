import { DeviceValue, DevicePropertyType } from '../../dto/device-property.dto'
import { DeviceShadow } from '../../../device-shadow/device-shadow'
import { DeviceShadowState } from '../../../device-shadow/device-shadow.dto'
import { DeviceInitialState } from '../device.dto'

export abstract class PropertyHandler {
  shadow: DeviceShadow
  constructor(shadow: DeviceShadow) {
    this.shadow = shadow
  }
  initial?: DeviceValue | DeviceValue[]
  property: DevicePropertyType
  abstract set(value: DeviceValue | DeviceValue[]): Promise<void>
  abstract get(): Promise<DeviceShadowState>
  abstract getInitial(): Promise<DeviceInitialState>
}
