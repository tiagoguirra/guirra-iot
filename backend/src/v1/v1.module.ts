import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod
} from '@nestjs/common'
import { OauthController } from './oauth/oauth.controller'
import { OauthModule } from '../oauth/oauth.module'
import { UserController } from './user/user.controller'
import { UserModule } from '../user/user.module'
import { OauthMiddleware } from '../oauth/oauth.middleware'
import { AlexaController } from './alexa/alexa.controller'
import { DeviceController } from './device/device.controller'
import { AlexaModule } from '../alexa/alexa.module'
import { DeviceModule } from '../device/device.module'

@Module({
  imports: [OauthModule, UserModule, AlexaModule, DeviceModule],
  controllers: [
    OauthController,
    UserController,
    AlexaController,
    DeviceController
  ]
})
export class V1Module implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .exclude(
        {
          path: 'v1/oauth/token',
          method: RequestMethod.POST
        },
        {
          path: 'v1/oauth/login',
          method: RequestMethod.POST
        }
      )
      .forRoutes(OauthController)
    consumer.apply(OauthMiddleware).forRoutes(DeviceController)
    consumer.apply(OauthMiddleware).forRoutes(AlexaController)
  }
}
