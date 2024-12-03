import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { BaseGateway } from './base.gateway';

@Injectable()
export class SocketService implements OnModuleInit, OnModuleDestroy {

  constructor(private readonly socketGateway: BaseGateway) {
      setInterval(() => {
        this.sendMessage('');
      }, 3000);
  }

  async onModuleInit() {
    await this.channelDiscovery();
  }

  async onModuleDestroy() {
    
  }

  private async channelDiscovery() {
   
  }

  async sendMessage(
    messagePayload : any
  ) {
    
   
  }
}
// @UseGuards(WebSocketAuthGuard)
//     @SubscribeMessage("")
//     sendMessage(
//         @MessageBody("message") message : string,
//         @MessageBody("type") type : string,
//         @ConnectedSocket() client: any,
//     ) { 
//         try {
//             client.join('test')
//             this.server.in('test').emit("message", {
//                 message : 'Hello word !'
//             })
//         } catch (error) {
           
//         }
       
//     }