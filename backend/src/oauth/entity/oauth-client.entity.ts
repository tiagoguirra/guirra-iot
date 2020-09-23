import { Model } from '../../entity/model'
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { OauthCodeEntity } from './oauth-code.entity'
import { OauthClientDto } from '../dto/oauth-client.dto'

@Entity('oauth_client')
export class OauthClientEntity extends Model {
  @PrimaryGeneratedColumn('uuid')
  client_id: string

  @Column('varchar')
  client_secret: string

  @Column('varchar', { nullable: true })
  redirect_url: string

  @Column('varchar', { nullable: true })
  type: string

  @Column('bool', { default: false })
  default: boolean

  @OneToMany(
    () => OauthCodeEntity,
    (code: OauthCodeEntity) => code.client
  )
  @JoinColumn({
    name: 'client_id',
    referencedColumnName: 'client_id'
  })
  codes: OauthCodeEntity[]
  toJson(): OauthClientDto {
    return {
      client_id: this.client_id,
      redirect_url: this.redirect_url
    }
  }
}
