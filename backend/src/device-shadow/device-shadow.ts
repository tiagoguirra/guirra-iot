import { IotData, AWSError } from 'aws-sdk'
import * as _ from 'lodash'
import { DeviceShadowState, DeviceShadowSettings } from './device-shadow.dto'

export class DeviceShadow {
  private readonly AwsIot: IotData
  private shandowName: string
  private lastState?: {
    timestamp: number
    state: IotData.GetThingShadowResponse
  }
  constructor(shandowName: string) {
    this.shandowName = shandowName
    this.AwsIot = new IotData({
      endpoint: process.env.AWS_IOT_ENDPOINT,
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_KEY_ID,
        secretAccessKey: process.env.AWS_KEY_SECRET
      }
    })
  }
  updateState(value: any, property?: string) {
    return new Promise((resolve, reject) => {
      this.AwsIot.updateThingShadow({
        payload: JSON.stringify({
          state: {
            desired: property ? { [property]: value } : value
          }
        }),
        thingName: this.shandowName
      }).send((err: AWSError, data: IotData.UpdateThingShadowResponse) => {
        if (err) {
          reject(err)
        } else {
          const payload = JSON.parse(data.payload.toString())
          resolve(_.get(payload, ['state', 'desired', property || '']))
        }
      })
    })
  }
  private requestState() {
    return new Promise((resolve, reject) => {
      if (this.lastState && this.lastState.state) {
        const now = new Date().getTime()
        if (now - this.lastState.timestamp < 2000) {
          return resolve(this.lastState.state)
        }
      }
      this.AwsIot.getThingShadow(
        {
          thingName: this.shandowName
        },
        (err: AWSError, data: IotData.GetThingShadowResponse) => {
          if (err) {
            reject(err)
          } else {
            this.lastState = {
              state: data,
              timestamp: new Date().getTime()
            }
            resolve(data)
          }
        }
      )
    })
  }
  getState(
    property?: string
  ): Promise<DeviceShadowState | DeviceShadowState[]> {
    return new Promise((resolve, reject) => {
      this.requestState()
        .then((data: IotData.GetThingShadowResponse) => {
          const payload = JSON.parse(data.payload.toString())
          if (property) {
            resolve({
              property,
              state: _.get(payload, ['state', 'reported', property]),
              delta: _.get(payload, ['state', 'delta', property]),
              last_report: _.get(payload, [
                'metadata',
                'reported',
                property,
                'timestamp'
              ]),
              timestamp: _.get(payload, ['timestamp'])
            })
          } else {
            const states = _.get(payload, ['state', 'reported'])
            const result: DeviceShadowState[] = []
            for (const key in states) {
              result.push({
                property: key,
                state: _.get(payload, ['state', 'reported', key]),
                delta: _.get(payload, ['state', 'delta', key]),
                last_report: _.get(payload, [
                  'metadata',
                  'reported',
                  key,
                  'timestamp'
                ]),
                timestamp: _.get(payload, ['timestamp'])
              })
            }
            resolve(result)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  getSettings(): Promise<DeviceShadowSettings> {
    return new Promise((resolve, reject) => {
      this.requestState()
        .then((data: IotData.GetThingShadowResponse) => {
          const payload = JSON.parse(data.payload.toString())
          resolve({
            initial_state: _.get(payload, [
              'state',
              'reported',
              'initialState'
            ]),
            ..._.get(payload, ['state', 'reported', 'config'])
          })
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
