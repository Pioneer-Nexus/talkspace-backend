import { Module } from "@nestjs/common";
import { MessageService } from "./services/message.service";
import { MessageResolver } from "./resolvers/message.resolver";
import { generateMongoProvider } from "@/utils/mongo";
import { Message } from "./schemas/message.schema";
import { MessageRepository } from "./repositories/message.repository";
import { AppDatabaseModule } from "@/infrastructures/database";

@Module({
	imports: [AppDatabaseModule],
	providers: [generateMongoProvider(Message), MessageResolver, MessageService, MessageRepository],
})
export class MessageModule {}
