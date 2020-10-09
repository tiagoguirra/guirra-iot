import * as _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { Log } from './log'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_HOST,
})

export const handler = async (payload, context) => {
  try {
    const { namespace, name } = _.get(payload, 'directive.header', {})
    let response = null
    Log('Handler', payload)
    switch (namespace) {
      case 'Alexa.Authorization':
        response = await api.post(
          '/v1/alexa/authorization',
          {
            code: _.get(payload, 'directive.payload.grant.code'),
          },
          {
            headers: {
              authorization: `Bearer ${_.get(
                payload,
                'directive.payload.grantee.token'
              )}`,
            },
          }
        )
        break
      case 'Alexa.Discovery':
        response = await api.get('/v1/alexa/discovery', {
          headers: {
            authorization: `Bearer ${_.get(
              payload,
              'directive.endpoint.scope.token',
              _.get(payload, 'directive.payload.scope.token')
            )}`,
          },
        })
        break
      case 'Alexa':
        if (name === 'ReportState') {
          response = await api.post(
            '/v1/alexa/report',
            {
              device_id: _.get(payload, 'directive.endpoint.endpointId'),
              correlationToken: _.get(
                payload,
                'directive.header.correlationToken'
              ),
              messageId: _.get(payload, 'directive.header.messageId'),
              endpoint: _.get(payload, 'directive.endpoint'),
            },
            {
              headers: {
                authorization: `Bearer ${_.get(
                  payload,
                  'directive.endpoint.scope.token'
                )}`,
              },
            }
          )
        }
        break
      default:
        // Controller
        response = await api.post(
          '/v1/alexa/change',
          {
            device_id: _.get(payload, 'directive.endpoint.endpointId'),
            correlationToken: _.get(
              payload,
              'directive.header.correlationToken'
            ),
            messageId: _.get(payload, 'directive.header.messageId'),
            endpoint: _.get(payload, 'directive.endpoint'),
            name: _.get(payload, 'directive.header.name'),
            namespace: _.get(payload, 'directive.header.namespace'),
            instance: _.get(payload, 'directive.header.instance'),
            payload: _.get(payload, 'directive.payload'),
          },
          {
            headers: {
              authorization: `Bearer ${_.get(
                payload,
                'directive.endpoint.scope.token'
              )}`,
            },
          }
        )
        break
    }
    if (response) {
      Log('Response', _.get(response, 'data'))
      return context.succeed(_.get(response, 'data'))
    }
    throw new Error('Application response invalid')
  } catch (err) {
    Log('Handler error', {
      code: _.get(err, 'state', _.get(err, 'code')),
      message: _.get(err, 'message'),
      data: _.get(err, 'response.data', ''),
    })
    return context.succeed({
      event: {
        header: {
          messageId: uuidv4(),
          name: 'ErrorResponse',
          namespace: 'Alexa',
          payloadVersion: '3',
        },
        payload: {
          type: 'INTERNAL_ERROR',
          message: _.get(
            err,
            'response.data',
            _.get(err, 'message', 'Falha interna')
          ),
        },
      },
    })
  }
}
