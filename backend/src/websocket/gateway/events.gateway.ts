import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  WsResponse,
  MessageBody
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { UseGuards } from '@nestjs/common'
import { WsAuthGuard } from 'src/guards/ws-auth.guard'
import * as _ from 'lodash'
import { OauthService } from '../../oauth/service/oauth.service'
import { SocketDto } from 'src/oauth/dto/socket.dto'
import { logDebug } from 'src/libraries/logger'

@WebSocketGateway(Number(process.env.WS_PORT) || 80, { namespace: 'events' })
export class EventsGateway implements OnGatewayConnection {
  constructor(private readonly OauthService: OauthService) {}
  @WebSocketServer()
  server: Server

  async handleConnection(client: SocketDto) {
    try {
      const authorization = _.get(client, 'handshake.query.authorization', '')
      if (authorization) {
        const oauthResolve = await this.OauthService.verify(authorization)
        if (oauthResolve) {
          client.oauth = oauthResolve
          client.join(_.get(oauthResolve, 'user.user_id', ''))
        }
      }
    } catch (err) {
      logDebug.debug('Failure to resolve user token')
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('handshake')
  handleMessage(@MessageBody() name: string): WsResponse<string> {
    return { event: 'hello', data: `Hi, ${name}` }
  }
}
