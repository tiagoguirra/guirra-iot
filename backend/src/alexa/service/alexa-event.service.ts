import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { DeviceAlexa } from '../interface/device.alexa'
import { DeviceDto } from '../../device/dto/device.dto'
import { AlexaAuthorizationService } from './alexa-authorization.service'
import { AlexaTokenDto } from '../dto/alexa-token.dto'
import { v4 as uuidv4 } from 'uuid'
import { logDebug } from 'src/libraries/logger'

@Injectable()
export class AlexaEventService {
  constructor(
    private readonly AuthorizationService: AlexaAuthorizationService
  ) {}
  async AddOrUpdateReport(device: DeviceDto) {
    try {
      const deviceAlexa = new DeviceAlexa(device)
      const credentials = await this.AuthorizationService.getCredentials(
        device.user_id
      )
      const response = await this.report(
        {
          event: {
            header: {
              namespace: 'Alexa.Discovery',
              name: 'AddOrUpdateReport',
              payloadVersion: '3',
              messageId: uuidv4()
            },
            payload: {
              endpoints: [deviceAlexa.discover()],
              scope: {
                type: 'BearerToken',
                token: credentials.access_token
              }
            }
          }
        },
        credentials
      )
      return response
    } catch (err) {
      logDebug.error('Falha ao reportar evento para alexa', err)
      return null
    }
  }
  async report(payload: any, token: AlexaTokenDto) {
    return await axios.post('https://api.amazonalexa.com/v3/events', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token.access_token
      }
    })
  }
}
