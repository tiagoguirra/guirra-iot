import { PropertyCapability } from './controllers/PropertyCapability'
import { DeviceDto } from '../../device/dto/device.dto'
import { DeviceShadow } from '../../device-shadow/device-shadow'
import * as _ from 'lodash'
import * as controllers from './controllers'
import {
  DeviceMapCategories,
  AlexaCategories
} from '../dto/alexa-categories.dto'
import { AlexaControllerMap } from '../dto/alexa-controller-map.dto'
import { ModeCapability } from './controllers/ModeCapability'

export class DeviceAlexa {
  protected capabilities: {
    [name: string]: PropertyCapability
  }
  protected modes: {
    [name: string]: ModeCapability
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

    for (const key in device.modes || []) {
      const mode = device.modes[key]
      this.modes = {
        ...this.modes,
        [mode.name]: new ModeCapability(this.shadow, {
          mode: mode.name,
          values: mode.values,
          initial: mode.initial,
          proactively: true,
          retrievable: true
        })
      }
    }
  }
  discover() {
    const capabilities = []
    for (const key in this.capabilities) {
      capabilities.push(this.capabilities[key].discovery())
    }

    for (const key in this.modes) {
      capabilities.push(this.modes[key].discovery())
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
      capabilities: [
        ...capabilities,
        {
          type: 'AlexaInterface',
          interface: 'Alexa',
          version: '3'
        },
        {
          type: 'AlexaInterface',
          interface: 'Alexa.EndpointHealth',
          version: '3',
          properties: {
            supported: [
              {
                name: 'connectivity'
              }
            ],
            proactivelyReported: true,
            retrievable: true
          }
        }
      ]
    }
  }
  change(
    {
      name,
      namespace,
      instance
    }: {
      name: string
      namespace: string
      instance?: string
    },
    payload: any
  ) {
    const handler = _.get(AlexaControllerMap, namespace)
    if (handler) {
      return this.capabilities[handler].change({ name, namespace }, payload)
    } else if (namespace === 'Alexa.ModeController') {
      const modeHandler = _.get(this.modes, instance)
      if (modeHandler) {
        return modeHandler.change({ instance }, payload)
      }
    }
    throw new Error('Device not suport this')
  }
  async reportState() {
    const state = []
    for (const key in this.capabilities) {
      const capability = this.capabilities[key]
      state.push(await capability.ReportState())
    }
    for (const key in this.modes) {
      const mode = this.modes[key]
      state.push(await mode.ReportState())
    }
    const connectivity = await this.shadow.getConnectivity()

    return [
      ...state,
      {
        namespace: 'Alexa.EndpointHealth',
        name: 'connectivity',
        timeOfSample: new Date().toISOString(),
        uncertaintyInMilliseconds: 0,
        value: {
          value: connectivity === 'disconnected' ? 'UNREACHABLE' : 'OK'
        }
      }
    ]
  }
  async changeReport(property: string, value: any) {
    const state = []
    const change = []
    for (const key in this.capabilities) {
      const capability = this.capabilities[key]
      if (property === key) {
        change.push(await capability.changeReport(value))
      } else {
        state.push(await capability.ReportState())
      }
    }
    for (const key in this.modes) {
      const mode = this.modes[key]
      if (property === key) {
        change.push(await mode.changeReport(value))
      } else {
        state.push(await mode.ReportState())
      }
    }
    return { state, change }
  }
}
