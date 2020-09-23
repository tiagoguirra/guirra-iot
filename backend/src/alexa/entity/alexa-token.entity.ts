import { Model } from '../../entity/model'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { UserEntity } from '../../user/entity/user.entity'
import * as moment from 'moment'
import * as _ from 'lodash'
import { AlexaTokenDto } from '../dto/alexa-token.dto'

@Entity('alexa_token')
export class AlexaTokenEntity extends Model {
  @PrimaryGeneratedColumn('uuid')
  alexa_token_id: string

  @Column('uuid')
  user_id: string

  @Column('varchar')
  access_token: string

  @Column('varchar')
  refresh_token: string

  @Column('numeric')
  expires_in: number

  @Column('varchar')
  token_type: string

  @Column('varchar')
  code: string

  @Column({
    type: 'timestamptz',
    default: () => 'now()'
  })
  created_at: Date

  @OneToMany(
    () => UserEntity,
    (user: UserEntity) => user.alexa_tokens
  )
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: UserEntity

  isValid() {
    const now = moment().unix()
    const expireAt = moment(this.created_at)
      .add(this.expires_in, 'seconds')
      .unix()
    return expireAt > now
  }
  toJson(): AlexaTokenDto {
    return {
      access_token: this.access_token,
      alexa_token_id: this.alexa_token_id,
      code: this.code,
      created_at: this.created_at,
      expires_in: this.expires_in,
      refresh_token: this.refresh_token,
      token_type: this.token_type,
      user_id: this.user_id
    }
  }
}
