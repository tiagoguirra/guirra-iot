import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { SocketService } from '../service/socket.service'

@WebSocketGateway(Number(process.env.WS_PORT) || 80)
export class AppGateway implements OnGatewayInit {
  constructor(private readonly socketService: SocketService) {}
  @WebSocketServer() public server: Server

  afterInit(server: Server) {
    this.socketService.socket = server
  }
}
