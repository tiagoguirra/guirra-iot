import { PropertyCapability } from './PropertyCapability'
import { LockHandler } from 'src/device/interface/handlers'
import * as _ from 'lodash'

export class LockCapability extends PropertyCapability {
  init() {
    this.handler = new LockHandler(this.shadow)
  }
  discovery() {
    return {
      type: 'AlexaInterface',
      interface: 'Alexa.LockController',
      version: '3',
      properties: {
        supported: [
          {
            name: 'lockState'
          }
        ],
        proactivelyReported: this.proactively,
        retrievable: this.retrievable
      }
    }
  }
  async change({ name }) {
    await this.handler.set(name)
    return {
      namespace: 'Alexa.LockController',
      name: 'lockState',
      value: name,
      timeOfSample: new Date().toISOString(),
      uncertaintyInMilliseconds: this.uncertainty
    }
  }
  async ReportState() {
    const state = await this.handler.get()
    return {
      namespace: 'Alexa.LockController',
      name: 'lockState',
      value: state.state,
      timeOfSample: new Date().toISOString(),
      uncertaintyInMilliseconds: 0
    }
  }
}
