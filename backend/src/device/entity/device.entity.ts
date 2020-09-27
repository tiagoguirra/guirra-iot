import { Model } from '../../entity/model'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { DeviceProperty } from '../dto/device-property.dto'
import { DeviceMode } from '../dto/device-mode.dto'
import { DeviceHistoryEntity } from './device-history.entity'
import { UserEntity } from 'src/user/entity/user.entity'
import { DeviceDto } from '../dto/device.dto'

@Entity('device')
export class DeviceEntity extends Model {
  @PrimaryGeneratedColumn('uuid')
  device_id: string

  @Column('varchar')
  device_shadow: string

  @Column('varchar')
  name: string

  @Column('varchar', { array: true })
  category: string[]

  @Column('varchar')
  template: string

  @Column('jsonb')
  properties: DeviceProperty[]

  @Column('jsonb', { nullable: true })
  modes: DeviceMode[]

  @OneToMany(
    () => DeviceHistoryEntity,
    (deviceHistory: DeviceHistoryEntity) => deviceHistory.device
  )
  @JoinColumn({ name: 'device_id', referencedColumnName: 'device_id' })
  histories: DeviceHistoryEntity[]

  @Column('uuid')
  user_id: string

  @OneToMany(
    () => UserEntity,
    (user: UserEntity) => user.devices
  )
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: UserEntity
  toJson(): DeviceDto {
    return {
      category: this.category,
      device_id: this.device_id,
      modes: this.modes,
      name: this.name,
      properties: this.properties,
      template: this.template,
      user_id: this.user_id,
      device_shadow: this.device_shadow
    }
  }
}
