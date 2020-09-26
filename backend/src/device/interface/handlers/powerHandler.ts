import { PropertyHandler } from './propertyHandler'
import { DeviceValue, DevicePropertyType } from '../../dto/device-property.dto'
import { DeviceShadowState } from '../../../device-shadow/device-shadow.dto'
import { DeviceInitialState } from '../device.dto'
import * as _ from 'lodash'

export class PowerHandler extends PropertyHandler {
  property: DevicePropertyType = DevicePropertyType.power
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
