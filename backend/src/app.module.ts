import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OauthModule } from './oauth/oauth.module'
import { V1Module } from './v1/v1.module'
import { UserModule } from './user/user.module'
import { DeviceModule } from './device/device.module'
import { AlexaModule } from './alexa/alexa.module'
import * as ormconfig from './config/ormconfig'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static')
    }),
    TypeOrmModule.forRoot(ormconfig),
    OauthModule,
    V1Module,
    UserModule,
    DeviceModule,
    AlexaModule,
    WebsocketModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
