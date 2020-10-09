import { DeviceShadow } from '../../../device-shadow/device-shadow'
import { ModeHandler } from '../../../device/interface/handlers/modeHandler'
import lang from '../../lang'
import * as _ from 'lodash'

export class ModeCapability {
  protected proactively: boolean = false
  protected retrievable: boolean = true
  protected initial: string
  protected uncertainty: number = 1000
  protected handler: ModeHandler
  protected shadow: DeviceShadow
  protected mode: string
  protected values: string[]

  constructor(
    shadow: DeviceShadow,
    props: {
      proactively?: boolean
      retrievable?: boolean
      initial?: string
      mode: string
      values: string[]
      uncertainty?: number
    }
  ) {
    this.initial = props.initial || null
    this.proactively = props.proactively || false
    this.retrievable = props.retrievable || true
    this.uncertainty = props.uncertainty || 1000
    this.shadow = shadow
    this.mode = props.mode
    this.values = props.values
    this.handler = new ModeHandler(this.mode, this.values, this.shadow)
  }
  discovery() {
    let friendlyNames = _.get(lang, ['pt_BR', this.mode])
    friendlyNames = Array.isArray(friendlyNames)
      ? friendlyNames
      : [friendlyNames]

    const supportedModes = this.values.map(value => {
      let friendlyNames = _.get(lang, ['pt_BR', value])
      friendlyNames = Array.isArray(friendlyNames)
        ? friendlyNames
        : [friendlyNames]

      const _mode = {
        value: value,
        modeResources: {
          friendlyNames: friendlyNames.map(item => ({
            '@type': 'text',
            value: {
              text: item,
              locale: 'pt_BR'
            }
          }))
        }
      }

      return _mode
    })

    return {
      type: 'AlexaInterface',
      interface: 'Alexa.ModeController',
      instance: this.mode,
      version: '3',
      properties: {
        supported: [
          {
            name: 'mode'
          }
        ],
        proactivelyReported: this.proactively,
        retrievable: this.retrievable
      },
      capabilityResources: {
        friendlyNames: friendlyNames.map(item => ({
          '@type': 'text',
          value: {
            text: item,
            locale: 'pt_BR'
          }
        }))
      },
      configuration: {
        ordered: false,
        supportedModes
      }
    }
  }
  async change({ instance }: { instance: string }, payload: any) {
    await this.handler.set(_.get(payload, 'mode'))
    return {
      namespace: 'Alexa.ModeController',
      instance,
      name: 'mode',
      value: _.get(payload, 'mode'),
      timeOfSample: new Date().toISOString(),
      uncertaintyInMilliseconds: this.uncertainty
    }
  }
  async ReportState() {
    const state = await this.handler.get()
    return {
      namespace: 'Alexa.ModeController',
      name: 'mode',
      value: state.value,
      instance: state.mode,
      timeOfSample: new Date().toISOString(),
      uncertaintyInMilliseconds: 0
    }
  }
  changeReport(value: string) {
    return {
      namespace: 'Alexa.ModeController',
      name: 'mode',
      value: value,
      timeOfSample: new Date().toISOString(),
      uncertaintyInMilliseconds: 0
    }
  }
}
