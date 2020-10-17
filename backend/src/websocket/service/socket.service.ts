import { Injectable } from '@nestjs/common'
import { Server } from 'socket.io'

@Injectable()
export class SocketService {
  public socket: Server = null

  sendRoom(namespace: string, room: string, event: string, body?: any) {
    if (this.socket) {
      this.socket.of(namespace).in(room).emit(event, body)
    }
  }
  send(namespace: string, event: string, body?: any) {
    if (this.socket) {
      this.socket.of(namespace).emit(event, body)
    }
  }
}
