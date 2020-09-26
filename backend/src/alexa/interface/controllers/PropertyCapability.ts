import { DeviceValue } from '../../../device/dto/device-property.dto'
import { PropertyHandler } from '../../../device/interface/handlers/propertyHandler'
import { DeviceShadow } from 'src/device-shadow/device-shadow'

export abstract class PropertyCapability {
  protected proactively: boolean = false
  protected retrievable: boolean = true
  protected initial: DeviceValue | DeviceValue[] = null
  protected uncertainty: number = 1000
  protected handler: PropertyHandler
  protected shadow: DeviceShadow
  constructor(
    shadow: DeviceShadow,
    props: {
      proactively?: boolean
      retrievable?: boolean
      initial?: DeviceValue | DeviceValue[]
      uncertainty?: number
    }
  ) {
    this.initial = props.initial || null
    this.proactively = props.proactively || false
    this.retrievable = props.retrievable || true
    this.uncertainty = props.uncertainty || 1000
    this.shadow = shadow
    this.init()
  }
  abstract discovery(): any
  abstract ReportState(): any
  abstract init(): void
  abstract change(
    { name, namespace }: { name: string; namespace: string },
    payload: any
  ): Promise<any>
}
