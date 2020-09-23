import { Injectable } from '@nestjs/common'
import { DeviceDto } from 'src/device/dto/device.dto'
import { DeviceAlexa } from '../interface/device.alexa'

@Injectable()
export class AlexaControllerService {
  async reportState(
    device: DeviceDto,
    {
      correlationToken,
      messageId,
      endpoint
    }: {
      correlationToken?: string
      messageId?: string
      endpoint: any
    }
  ) {
    const deviceAlexa = new DeviceAlexa(device)
    const state = await deviceAlexa.reportState()
    return {
      event: {
        header: {
          namespace: 'Alexa',
          name: 'StateReport',
          messageId,
          correlationToken: correlationToken,
          payloadVersion: '3'
        },
        endpoint: endpoint,
        payload: {}
      },
      context: {
        properties: state
      }
    }
  }
  async change(
    device: DeviceDto,
    {
      name,
      namespace,
      correlationToken,
      messageId,
      endpoint
    }: {
      name: string
      namespace: string
      correlationToken?: string
      messageId?: string
      endpoint: any
    },
    payload: any
  ) {
    const deviceAlexa = new DeviceAlexa(device)
    const state = await deviceAlexa.change({ name, namespace }, payload)
    return {
      event: {
        header: {
          namespace: 'Alexa',
          name: 'Response',
          messageId,
          correlationToken: correlationToken,
          payloadVersion: '3'
        },
        endpoint: endpoint,
        payload: {}
      },
      context: {
        properties: Array.isArray(state) ? state : [state]
      }
    }
  }
}
