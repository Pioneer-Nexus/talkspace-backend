import { Module } from '@nestjs/common';
import { MessageService } from './services/message.service';
import { MessageResolver } from './resolvers/message.resolver';

@Module({
  providers: [MessageResolver, MessageService],
})
export class MessageModule {}
