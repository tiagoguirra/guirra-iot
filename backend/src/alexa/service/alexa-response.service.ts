import { Injectable } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { DeviceDto } from 'src/device/dto/device.dto'
import { DeviceAlexa } from '../interface/device.alexa'

@Injectable()
export class AlexaResponseService {
  authorization() {
    return {
      event: {
        header: {
          namespace: 'Alexa.Authorization',
          name: 'AcceptGrant.Response',
          messageId: uuidv4(),
          payloadVersion: '3'
        },
        payload: {}
      }
    }
  }
  discovery(devices: DeviceDto[]) {
    const deviceNormalized = []
    for (const i in devices) {
      const deviceAlexa = new DeviceAlexa(devices[i])
      deviceNormalized.push(deviceAlexa.discover())
    }
    return {
      event: {
        header: {
          name: 'Discover.Response',
          namespace: 'Alexa.Discovery',
          messageId: uuidv4(),
          payloadVersion: '3'
        },
        payload: {
          endpoints: deviceNormalized
        }
      }
    }
  }
}
