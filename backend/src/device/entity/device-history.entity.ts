import { Model } from '../../entity/model'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { DeviceEntity } from './device.entity'

@Entity('device_history')
export class DeviceHistoryEntity extends Model {
  @PrimaryGeneratedColumn('uuid')
  device_history_id: string

  @Column('uuid')
  device_id: string

  @ManyToOne(
    () => DeviceEntity,
    (device: DeviceEntity) => device.histories
  )
  @JoinColumn({ name: 'device_id', referencedColumnName: 'device_id' })
  device: DeviceEntity

  @Column('varchar')
  event: string

  @Column('uuid', { nullable: true })
  user_id: string

  @Column({
    type: 'timestamptz',
    default: () => 'now()'
  })
  created_at: Date
}
