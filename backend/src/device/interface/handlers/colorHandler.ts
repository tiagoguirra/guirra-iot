import { PropertyHandler } from './propertyHandler'
import { DeviceValue, DevicePropertyType } from '../../dto/device-property.dto'
import { DeviceShadowState } from '../../../device-shadow/device-shadow.dto'
import { DeviceInitialState } from '../device.dto'
import * as _ from 'lodash'

export class ColorHandler extends PropertyHandler {
  property: DevicePropertyType = DevicePropertyType.color
  async get(): Promise<DeviceShadowState> {
    const state = await this.shadow.requestState()
    const deltaValue = _.get(state, ['delta'])
    let delta = {
      red: _.get(state, ['delta', 'red'], 0),
      green: _.get(state, ['delta', 'green'], 0),
      blue: _.get(state, ['delta', 'blue'], 0)
    }
    return {
      state: {
        red: _.get(state, ['state', 'red'], 0),
        green: _.get(state, ['state', 'green'], 0),
        blue: _.get(state, ['state', 'blue'], 0)
      },
      last_report: _.get(state, ['last_report', 'blue', 'timestamp'], 0),
      timestamp: state.timestamp,
      property: this.property,
      ...(deltaValue ? { delta } : {})
    }
  }

  async set(value: DeviceValue): Promise<void> {
    await this.shadow.updateState({
      red: _.get(value, 'red', 0),
      green: _.get(value, 'green', 0),
      blue: _.get(value, 'blue', 0)
    })
  }
  async getInitial(): Promise<DeviceInitialState> {
    const settings = await this.shadow.getSettings()
    return {
      property: this.property,
      value: {
        red: _.get(settings, ['initialState', 'red']),
        green: _.get(settings, ['initialState', 'green']),
        blue: _.get(settings, ['initialState', 'blue'])
      }
    }
  }
}
