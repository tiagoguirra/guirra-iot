import { PropertyHandler } from './propertyHandler'
import {
  DevicePropertyType,
  DeviceValue
} from 'src/device/dto/device-property.dto'
import { DeviceShadowState } from 'src/device-shadow/device-shadow.dto'
import { DeviceInitialState } from '../device.dto'
import * as _ from 'lodash'

export class BrightnessHandler extends PropertyHandler {
  property: DevicePropertyType = DevicePropertyType.brightness
  get(): Promise<DeviceShadowState> {
    return this.shadow.getState(this.property) as Promise<DeviceShadowState>
  }
  async set(value: DeviceValue): Promise<void> {
    await this.shadow.updateState(value, this.property)
  }
  async getInitial(): Promise<DeviceInitialState> {
    const settings = await this.shadow.getSettings()
    return {
      property: this.property,
      value: _.get(settings, ['initialState', this.property])
    }
  }
}
