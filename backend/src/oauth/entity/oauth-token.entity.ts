import { Model } from '../../entity/model'
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne
} from 'typeorm'
import { OauthCodeEntity } from './oauth-code.entity'

@Entity('oauth_token')
export class OauthTokenEntity extends Model {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column('varchar')
  token: string

  @Column('varchar')
  refresh_token: string

  @Column('numeric')
  expires_in: number

  @Column('varchar')
  token_type: string

  @Column({
    type: 'timestamptz',
    default: () => 'now()'
  })
  created_at: Date

  @Column('uuid')
  code_id: string

  @ManyToOne(
    () => OauthCodeEntity,
    (code: OauthCodeEntity) => code.tokens
  )
  @JoinColumn({ name: 'code_id', referencedColumnName: 'code_id' })
  code: OauthCodeEntity
}
