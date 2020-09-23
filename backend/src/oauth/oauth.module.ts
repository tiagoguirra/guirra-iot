import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OauthService } from './service/oauth.service'
import { OauthClientEntity } from './entity/oauth-client.entity'
import { OauthCodeEntity } from './entity/oauth-code.entity'
import { OauthTokenEntity } from './entity/oauth-token.entity'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      OauthClientEntity,
      OauthCodeEntity,
      OauthTokenEntity
    ])
  ],
  providers: [OauthService],
  exports: [OauthService]
})
export class OauthModule {}
