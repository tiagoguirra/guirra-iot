export interface DeviceHistoricMetadata {
  type: string
  [name: string]: any
}

export interface DeviceHistoricChanges {
  property: string
  value: any
  cause?: string
}

export interface DeviceHistoricDto {}
