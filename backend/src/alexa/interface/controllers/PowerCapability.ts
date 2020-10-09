import { PropertyCapability } from './PropertyCapability'
import { PowerHandler } from 'src/device/interface/handlers'

export class PowerCapability extends PropertyCapability {
  init() {
    this.handler = new PowerHandler(this.shadow)
  }
  discovery() {
    return {
      type: 'AlexaInterface',
      interface: 'Alexa.PowerController',
      version: '3',
      properties: {
        supported: [
          {
            name: 'powerState'
          }
        ],
        proactivelyReported: this.proactively,
        retrievable: this.retrievable
      }
    }
  }
  async change({ name: value }: { name: string }) {
    const _value = value === 'TurnOn' ? 'ON' : 'OFF'
    await this.handler.set(_value)
    return {
      namespace: 'Alexa.PowerController',
      name: 'powerState',
      value: _value,
      timeOfSample: new Date().toISOString(),
      uncertaintyInMilliseconds: this.uncertainty
    }
  }
  async ReportState() {
    const state = await this.handler.get()
    return {
      namespace: 'Alexa.PowerController',
      name: 'powerState',
      value: state.state,
      timeOfSample: new Date().toISOString(),
      uncertaintyInMilliseconds: 0
    }
  }
  changeReport(value: string) {
    return {
      namespace: 'Alexa.PowerController',
      name: 'powerState',
      value: value,
      timeOfSample: new Date().toISOString(),
      uncertaintyInMilliseconds: 0
    }
  }
}
