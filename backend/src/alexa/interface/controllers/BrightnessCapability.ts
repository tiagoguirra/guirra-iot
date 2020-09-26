import { PropertyCapability } from './PropertyCapability'
import { BrightnessHandler } from 'src/device/interface/handlers'
import * as _ from 'lodash'

export class BrightnessCapability extends PropertyCapability {
  init() {
    this.handler = new BrightnessHandler(this.shadow)
  }
  discovery() {
    return {
      type: 'AlexaInterface',
      interface: 'Alexa.BrightnessController',
      version: '3',
      properties: {
        supported: [
          {
            name: 'brightness'
          }
        ],
        proactivelyReported: this.proactively,
        retrievable: this.retrievable
      }
    }
  }
  async change({}, payload: any) {
    const value = _.get(payload, 'brightness', 0)
    await this.handler.set(value)
    return {
      namespace: 'Alexa.BrightnessController',
      name: 'brightness',
      value: value,
      timeOfSample: new Date().toISOString(),
      uncertaintyInMilliseconds: this.uncertainty
    }
  }
  async ReportState() {
    const state = await this.handler.get()
    return {
      namespace: 'Alexa.BrightnessController',
      name: 'brightness',
      value: state.state,
      timeOfSample: new Date().toISOString(),
      uncertaintyInMilliseconds: 0
    }
  }
}
