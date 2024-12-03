import { Inject, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ILoggerService } from "../logger";
import { WebSocketAuthGuard } from "@/modules/auth/guards/ws.guard";
@WebSocketGateway(80,{
    transports: ["websocket"],
    cors: {
      origin: "*",
    },
})
export class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject() private logger : ILoggerService,
    ) {}
    @WebSocketServer()
    server : any;

    handleConnection(client: any, ...args: any[]) {
        this.logger.info('Socket connecting !')
        return true
    }
    handleDisconnect(client: any) {
        
    }

    afterInit(server: any) {
        this.logger.info('Socket connected !')
        return true
    }
  
}