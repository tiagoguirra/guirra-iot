import { Module } from '@nestjs/common'
import { EventsGateway } from './gateway/events.gateway'
import { OauthModule } from '../oauth/oauth.module'
import { AppGateway } from './gateway/app.gateway'
import { SocketService } from './service/socket.service'

@Module({
  imports: [OauthModule],
  providers: [EventsGateway, AppGateway, SocketService],
  exports: [SocketService]
})
export class WebsocketModule {}
