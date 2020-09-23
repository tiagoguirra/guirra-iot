export enum DevicePropertyType {
  power = 'power',
  color = 'color',
  brightness = 'brightness',
  contactSensor = 'contactSensor',
  lock = 'lock'
}
export enum DevicePropertyValue {
  on = 'on',
  off = 'off',
  lock = 'lock',
  unlock = 'unlock',
  numeric = 'numeric',
  object = 'object',
  detect = 'detect',
  noDetect = 'noDetect'
}
export type DeviceValue = DevicePropertyValue | number | object | string
export interface DeviceProperty {
  name: DevicePropertyType
  values?: DevicePropertyValue | DevicePropertyValue[]
  range?: {
    start: number
    end: number
    step: number
  }
  initial: DeviceValue | DeviceValue[]
  proactively?: boolean
  retrievable?: boolean
}
