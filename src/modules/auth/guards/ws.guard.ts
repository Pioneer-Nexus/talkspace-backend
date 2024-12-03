import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth.service';

@Injectable()
export class WebSocketAuthGuard implements CanActivate {
  constructor(
    readonly jwt: AuthService,
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization;
    if (!token) {
      throw new WsException('Unauthorized access.');
    }

    try {
      const payload = this.jwt.verifyAccessToken(token)
      client['user'] = payload
    } catch (error) {
      throw new WsException('Unauthorized access.');
    }
    return true
  }
}