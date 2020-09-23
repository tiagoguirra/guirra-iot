import { PropertyCapability } from './controllers/PropertyCapability'
import { DeviceDto } from '../../device/dto/device.dto'
import { DeviceShadow } from '../../device-shadow/device-shadow'
import * as _ from 'lodash'
import * as controllers from './controllers'
import {
  DeviceMapCategories,
  AlexaCategories
} from '../dto/alexa-categories.dto'

export class DeviceAlexa {
  protected capabilities: {
    [name: string]: PropertyCapability
  }
  protected device: DeviceDto
  protected shadow: DeviceShadow
  constructor(device: DeviceDto) {
    this.device = device
    this.shadow = new DeviceShadow(this.device.device_shadow)
    for (const key in device.properties) {
      const property = device.properties[key]
      const handlerName = `${_.capitalize(property.name)}Capability`
      if (controllers[handlerName]) {
        this.capabilities = {
          ...this.capabilities,
          [property.name]: new controllers[handlerName](this.shadow, {
            proactively: property.proactively,
            retrievable: property.retrievable,
            initial: property.initial
          })
        }
      }
    }
  }
  discover() {
    const capabilities = []
    for (const key in this.capabilities) {
      capabilities.push(this.capabilities[key].discovery())
    }
    const categories = (this.device.category || []).map(item =>
      _.get(DeviceMapCategories, item, AlexaCategories.OTHER)
    )
    return {
      endpointId: this.device.device_id,
      manufacturerName: this.device.template,
      friendlyName: this.device.name,
      description: 'Smart Home DIY',
      displayCategories:
        categories.length > 0 ? categories : [AlexaCategories.OTHER],
      capabilities
    }
  }
  change(
    {
      name,
      namespace
    }: {
      name: string
      namespace: string
    },
    payload: any
  ) {
    switch (namespace) {
      case 'Alexa.PowerController':
        return this.capabilities['power'].change(name)
      case 'Alexa.BrightnessController':
      case 'Alexa.ColorController':
      case 'Alexa.LockController':
      default:
        throw new Error('Device not suport this')
    }
  }
  async reportState() {
    const state = []
    for (const key in this.capabilities) {
      const capability = this.capabilities[key]
      state.push(await capability.ReportState())
    }
    return state
  }
}
