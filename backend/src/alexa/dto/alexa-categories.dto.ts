export enum AlexaCategories {
  LIGHT = 'LIGHT',
  SMARTLOCK = 'SMARTLOCK',
  SWITCH = 'SWITCH',
  CONTACT_SENSOR = 'CONTACT_SENSOR',
  OTHER = 'OTHER',
}

export const DeviceMapCategories = {
  light: AlexaCategories.LIGHT,
  smartlock: AlexaCategories.SMARTLOCK,
  switch: AlexaCategories.SWITCH,
  contact_sensor: AlexaCategories.CONTACT_SENSOR,
  other: AlexaCategories.OTHER
}
