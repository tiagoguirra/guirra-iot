export interface DeviceEvent {
  event: string
  device_id: string
}
export type DevicePayload = DeviceRegister | DeviceChange

export interface DeviceRegister extends DeviceEvent {
  event: 'register_device'
  password: string
  username: string
  device_name: string
  properties: {
    [name: string]: number | string | object
  }
  device_template: string
  modes?: {
    [name: string]: string
  }
}
export interface DeviceChange extends DeviceEvent {
  event: 'physical_interaction'
  property: string
  state: {
    [key: string]: number | string | object
  }
}

export const modeValues = {
  'color.effect.mode': ['color.effect.smooth', 'color.effect.solid'],
}

export const deviceCategory = {
  light_rgb: ['light'],
}
