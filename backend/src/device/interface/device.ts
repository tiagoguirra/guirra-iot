import { DeviceValue, DevicePropertyType } from '../dto/device-property.dto'
import { PropertyHandler } from './handlers/propertyHandler'
import { DeviceDto } from '../dto/device.dto'
import * as handlers from './handlers'
import * as _ from 'lodash'
import { DeviceShadow } from '../../device-shadow/device-shadow'
import { capitalize } from 'lodash'
import { DeviceShadowValue } from '../../device-shadow/device-shadow.dto'
import { DeviceSettings } from './device.dto'
import { ModeHandler } from './handlers/modeHandler'

export class Device {
  protected properties: {
    [name: string]: PropertyHandler
  }
  protected modes: {
    [name: string]: ModeHandler
  }
  protected device: DeviceDto
  protected shadow: DeviceShadow
  constructor(device: DeviceDto) {
    this.device = device
    this.shadow = new DeviceShadow(this.device.device_shadow)
    for (const key in device.properties) {
      const property = device.properties[key]
      const handlerName = `${capitalize(property.name)}Handler`
      if (handlers[handlerName]) {
        this.properties = {
          ...this.properties,
          [property.name]: new handlers[handlerName](this.shadow)
        }
      }
    }
    for (const key in device.modes || []) {
      const mode = device.modes[key]
      this.modes = {
        ...this.modes,
        [mode.name]: new ModeHandler(mode.name, mode.values, this.shadow)
      }
    }
  }

  set(
    property: DevicePropertyType,
    value: DeviceValue | DeviceValue[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const prop = this.properties[property]
      const mode = this.modes[property]
      if (prop) {
        return prop
          .set(value)
          .then(() => resolve())
          .catch(err =>
            reject({
              message: _.get(err, 'message', 'Failure to set property')
            })
          )
      } else if (mode) {
        return mode
          .set(value as string)
          .then(() => resolve())
          .catch(err =>
            reject({
              message: _.get(err, 'message', 'Failure to set property')
            })
          )
      } else {
        reject({
          message: 'Device do not suport this',
          error: ''
        })
      }
    })
  }
  get(property?: string): Promise<DeviceShadowValue | DeviceShadowValue[]> {
    return new Promise(async (resolve, reject) => {
      try {
        if (property) {
          const prop = _.get(this.properties, property)
          const mode = _.get(this.modes, property)
          if (!prop && !mode) {
            throw new Error('Device do not suport this')
          }
          const value = prop ? await prop.get() : await mode.get()
          return resolve(value)
        } else {
          const values: DeviceShadowValue[] = []
          for (const key in this.properties) {
            const prop = this.properties[key]
            const value = await prop.get()
            values.push(value)
          }
          for (const key in this.modes) {
            const mode = this.modes[key]
            const value = await mode.get()
            values.push(value)
          }

          return resolve(values)
        }
      } catch (err) {
        reject({
          message: _.get(err, 'message', 'Failure to get status'),
          error: err,
          code: _.get(err, 'code', '')
        })
      }
    })
  }
  getSettings(): Promise<DeviceSettings> {
    return new Promise(async (resolve, reject) => {
      try {
        const _setting = await this.shadow.getSettings()
        const settings: DeviceSettings = {
          pulse: _setting.pulse || 0,
          initialState: []
        }
        for (const key in this.properties) {
          const prop = this.properties[key]
          const value = await prop.getInitial()
          settings.initialState.push(value)
        }
        return resolve(settings)
      } catch (err) {
        reject({
          message: _.get(err, 'message', 'Failure to get status'),
          error: err,
          code: _.get(err, 'code', '')
        })
      }
    })
  }
}
