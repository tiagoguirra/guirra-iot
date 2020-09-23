import { Model } from '../../entity/model'
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  JoinColumn,
  ManyToOne
} from 'typeorm'
import { OauthClientEntity } from './oauth-client.entity'
import { OauthTokenEntity } from './oauth-token.entity'
import { OauthCodeDto } from '../dto/oaut-code.dto'
import { UserEntity } from 'src/user/entity/user.entity'

@Entity('oauth_code')
export class OauthCodeEntity extends Model {
  @PrimaryGeneratedColumn('uuid')
  code_id: string

  @Column('varchar')
  code: string

  @Column('uuid')
  client_id: string

  @Column('numeric')
  expires_in: number

  @Column({
    type: 'timestamptz',
    default: () => 'now()'
  })
  created_at: Date

  @Column('varchar', { array: true })
  scopes: string[]

  @Column('uuid')
  user_id: string

  @OneToMany(
    () => UserEntity,
    (user: UserEntity) => user.codes
  )
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: UserEntity

  @ManyToOne(
    () => OauthClientEntity,
    (client: OauthClientEntity) => client.codes
  )
  @JoinColumn({ name: 'client_id', referencedColumnName: 'client_id' })
  client: OauthClientEntity

  @OneToMany(
    () => OauthTokenEntity,
    (client: OauthTokenEntity) => client.code
  )
  @JoinColumn({ name: 'code_id', referencedColumnName: 'code_id' })
  tokens: OauthTokenEntity[]
  toJson(): OauthCodeDto {
    return {
      client_id: this.client_id,
      code: this.code,
      code_id: this.code_id,
      created_at: this.created_at,
      expires_in: this.expires_in,
      scopes: this.scopes || []
    }
  }
}
