import { IotData, AWSError } from 'aws-sdk'
import * as _ from 'lodash'
import { DeviceShadowState, DeviceShadowSettings } from './device-shadow.dto'

export class DeviceShadow {
  private readonly AwsIot: IotData
  private shandowName: string
  private lastState?: {
    timestamp: number
    payload: any
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
  requestState(): Promise<{
    payload: any
    state: any
    delta: any
    last_report: any
    timestamp: number
  }> {
    return new Promise((resolve, reject) => {
      if (this.lastState && this.lastState.payload) {
        const now = new Date().getTime()
        if (now - this.lastState.timestamp < 2000) {
          return resolve({
            payload: this.lastState.payload,
            state: _.get(this.lastState.payload, ['state', 'reported']),
            delta: _.get(this.lastState.payload, ['state', 'delta']),
            last_report: _.get(this.lastState.payload, [
              'metadata',
              'reported'
            ]),
            timestamp: new Date().getTime()
          })
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
            const payload = JSON.parse(_.get(data, 'payload').toString())
            this.lastState = {
              payload,
              timestamp: new Date().getTime()
            }
            resolve({
              payload,
              state: _.get(payload, ['state', 'reported']),
              delta: _.get(payload, ['state', 'delta']),
              last_report: _.get(payload, ['metadata', 'reported']),
              timestamp: new Date().getTime()
            })
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
        .then(({ payload }) => {
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
        .then(({ payload }) => {
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
  getConnectivity(): Promise<'disconnected' | 'connected'> {
    return new Promise((resolve, reject) => {
      this.requestState()
        .then(({ payload }) => {
          const timestamp = _.get(payload, ['timestamp'])
          const lastReport = _.get(payload, [
            'metadata',
            'reported',
            'config',
            'device_name',
            'timestamp'
          ])
          const diffTime = timestamp - lastReport
          resolve(diffTime > 60000 ? 'disconnected' : 'connected')
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
