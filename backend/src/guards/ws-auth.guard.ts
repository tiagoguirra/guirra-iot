import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { SocketDto } from '../oauth/dto/socket.dto'

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: SocketDto = context.switchToWs().getClient() as SocketDto
    if (client && client.oauth && client.oauth.user) {
      return true
    }
    return false
  }
}
