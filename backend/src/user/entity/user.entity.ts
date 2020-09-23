import { Model } from '../../entity/model'
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  JoinColumn,
  Index
} from 'typeorm'
import { OauthCodeEntity } from '../../oauth/entity/oauth-code.entity'
import { UserDto } from '../dto/user.dto'
import { AlexaTokenEntity } from '../../alexa/entity/alexa-token.entity'
import { DeviceEntity } from 'src/device/entity/device.entity'

@Entity('user')
export class UserEntity extends Model {
  protected _hide: string[] = ['password', 'codes']

  @PrimaryGeneratedColumn('uuid')
  user_id: string

  @Column('varchar')
  name: string

  @Index({ unique: true })
  @Column('varchar')
  email: string

  @Column('varchar')
  password: string

  @OneToMany(
    () => OauthCodeEntity,
    (code: OauthCodeEntity) => code.user
  )
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  codes: OauthCodeEntity[]

  @OneToMany(
    () => AlexaTokenEntity,
    (AlexaToken: AlexaTokenEntity) => AlexaToken.user
  )
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  alexa_tokens: AlexaTokenEntity[]

  @OneToMany(
    () => DeviceEntity,
    (device: DeviceEntity) => device.user
  )
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  devices: DeviceEntity[]

  toJson(): UserDto {
    return {
      email: this.email,
      user_id: this.user_id,
      name: this.name
    }
  }
}
