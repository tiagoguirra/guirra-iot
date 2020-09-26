import { PropertyCapability } from './PropertyCapability'
import { ColorHandler } from '../../../device/interface/handlers'
import { hsbToRgb, rgbToHsb } from '../../../libraries/color'
import * as _ from 'lodash'

export class ColorCapability extends PropertyCapability {
  init() {
    this.handler = new ColorHandler(this.shadow)
  }
  discovery() {
    return {
      type: 'AlexaInterface',
      interface: 'Alexa.ColorController',
      version: '3',
      properties: {
        supported: [
          {
            name: 'color'
          }
        ],
        proactivelyReported: this.proactively,
        retrievable: this.retrievable
      }
    }
  }
  async change({}, payload) {
    const value = _.get(payload, 'color')
    const rgb = hsbToRgb(
      _.get(value, 'hue', 0),
      _.get(value, 'saturation', 0),
      _.get(value, 'brightness', 0)
    )
    await this.handler.set(rgb)
    return {
      namespace: 'Alexa.ColorController',
      name: 'color',
      value,
      timeOfSample: new Date().toISOString(),
      uncertaintyInMilliseconds: this.uncertainty
    }
  }
  async ReportState() {
    const state = await this.handler.get()

    return {
      namespace: 'Alexa.ColorController',
      name: 'color',
      value: rgbToHsb(
        _.get(state, 'state.red', 0),
        _.get(state, 'state.green', 0),
        _.get(state, 'state.blue', 0)
      ),
      timeOfSample: new Date().toISOString(),
      uncertaintyInMilliseconds: 0
    }
  }
}
