import { ValidateNested, IsNotEmpty, IsOptional } from 'class-validator'
import {
  DevicePropertyType,
  DeviceValue
} from 'src/device/dto/device-property.dto'

export class DeviceInputPropertyDto {
  @IsNotEmpty()
  name: DevicePropertyType
  range?: {
    start: number
    end: number
    step: number
  }
  @IsNotEmpty()
  initial: DeviceValue | DeviceValue[]
  proactively?: boolean
  retrievable?: boolean
}

export class DeviceInputModesDto {
  @IsNotEmpty()
  name: string
  @IsNotEmpty()
  values: string[]
  @IsNotEmpty()
  initial: string
}

export class DeviceInputDto {
  @IsNotEmpty()
  category: string[]
  @IsOptional()
  @ValidateNested({ each: true })
  modes?: DeviceInputModesDto[]
  template: string
  @ValidateNested({ each: true })
  properties: DeviceInputPropertyDto[]
  @IsNotEmpty()
  name: string
  @IsNotEmpty()
  device_shadow: string
}

export class DeviceChangeInput {
  property: DevicePropertyType
  value: DeviceValue | DeviceValue[]
}
