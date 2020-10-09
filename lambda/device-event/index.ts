import * as _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { Log } from './log'
import axios from 'axios'
import { DynamoDB, AWSError } from 'aws-sdk'
import * as moment from 'moment'
import {
  DeviceRegister,
  modeValues,
  deviceCategory,
  DevicePayload,
  DeviceChange,
} from './interface'

const api = axios.create({
  baseURL: process.env.API_HOST,
})
const dynamoDB = new DynamoDB.DocumentClient()

interface Tokens {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  device_id: string
  updated_at: string
}
const findTokens = (deviceId: string): Promise<Tokens> => {
  return new Promise((resolve, reject) => {
    dynamoDB.get(
      {
        TableName: 'iot-tokens',
        Key: {
          device_id: deviceId,
        },
      },
      (err: AWSError, data: DynamoDB.DocumentClient.GetItemOutput) => {
        if (err) {
          console.log('Falha ao buscar tokens', err)
          reject(err)
        } else {
          resolve(_.get(data, 'Item') as Tokens)
        }
      }
    )
  })
}

const saveTokens = (
  deviceId: string,
  tokens: {
    access_token: string
    refresh_token: string
    expires_in: number
    token_type: string
  }
): Promise<Tokens> => {
  return new Promise(async (resolve, reject) => {
    const savedToken = {
      access_token: _.get(tokens, 'access_token'),
      refresh_token: _.get(tokens, 'refresh_token'),
      expires_in: _.get(tokens, 'expires_in'),
      token_type: _.get(tokens, 'token_type'),
      updated_at: moment().toISOString(),
      device_id: deviceId,
    }
    dynamoDB.put(
      {
        TableName: 'iot-tokens',
        Item: savedToken,
      },
      (err: AWSError, data: DynamoDB.DocumentClient.PutItemOutput) => {
        if (err) {
          reject(err)
        } else {
          resolve(savedToken as Tokens)
        }
      }
    )
  })
}

const registerTokens = async (
  deviceId: string,
  username: string,
  password: string
): Promise<Tokens> => {
  const response = await api.post('/v1/oauth/token', {
    username,
    password,
    grant_type: 'password',
    client_id: process.env.IOT_CLIENT_ID,
    client_secret: process.env.IOT_CLIENT_SECRET,
  })
  return await saveTokens(deviceId, _.get(response, 'data', {}))
}
const updateTokens = async (token: Tokens): Promise<Tokens> => {
  const response = await api.post('/v1/oauth/token', {
    grant_type: 'refresh_token',
    refresh_token: token.refresh_token,
    client_id: process.env.IOT_CLIENT_ID,
    client_secret: process.env.IOT_CLIENT_SECRET,
  })
  return await saveTokens(token.device_id, _.get(response, 'data', {}))
}
const tokenIsValid = (token: Tokens): boolean => {
  const creation = _.get(token, 'updated_at')
  const expires = _.get(token, 'expires_in')
  const now = moment().unix()
  const expireAt = moment(creation).add(expires, 'seconds').unix()
  Log('Token check', { now, expireAt, creation, expires })
  return expireAt > now
}

const getCredentials = async (deviceId: string) => {
  let token = await findTokens(deviceId)
  if (!token) {
    return null
  }
  if (!tokenIsValid(token)) {
    token = await updateTokens(token)
  }
  Log('Tokens', token)
  return token
}

const register = async (payload: DeviceRegister) => {
  const {
    device_id,
    username,
    password,
    device_name,
    properties,
    modes,
    device_template,
  } = payload
  let tokens = await getCredentials(device_id)
  if (!tokens) {
    await registerTokens(device_id, username, password)
  }
  const _properties = []
  const _modes = []
  for (let name in properties) {
    const initial = properties[name]
    _properties.push({
      name,
      initial,
      proactively: true,
      retrievable: true,
    })
  }
  for (let name in modes) {
    const initial = modes[name]
    _modes.push({
      name,
      values: modeValues[name],
      initial: initial,
    })
  }
  const response = await api.post(
    '/v1/device/createOrUpdate',
    {
      name: device_name,
      category: _.get(deviceCategory, device_template, ['switch']),
      template: device_template || 'switch',
      modes: _modes,
      properties: _properties,
      device_shadow: device_id,
    },
    {
      headers: {
        authorization: `${tokens.token_type} ${tokens.access_token}`,
      },
    }
  )
  return _.get(response, 'data')
}
const changeProperty = async (payload: DeviceChange) => {
  const tokens = await getCredentials(payload.device_id)
  if (tokens) {
    const response = await api.post(
      `/v1/device/${payload.device_id}/event`,
      {
        property: _.get(payload, 'property'),
        value: _.get(payload, 'value', ''),
        cause: payload.event,
      },
      {
        headers: {
          authorization: `${tokens.token_type} ${tokens.access_token}`,
        },
      }
    )
    return _.get(response, 'data')
  } else {
    Log('Credenciais não encontrada', payload.device_id)
  }
  return null
}
export const handler = async (
  payload: DevicePayload,
  context,
  callback: Function
) => {
  try {
    Log('Event', payload)
    switch (payload.event) {
      case 'register_device':
        await register(payload)
        break
      case 'physical_interaction':
        await changeProperty(payload)
        break
    }
    callback()
  } catch (err) {
    Log('Falha ao resolver evento device', {
      code: _.get(err, 'state', _.get(err, 'code')),
      message: _.get(err, 'message'),
      data: _.get(err, 'response.data', ''),
    })
    callback(err)
  }
}
