import { AppDatabaseModule } from "@/infrastructures/database";
import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { Room } from "./schemas/room.schema";
import { ChatRoomResolver } from "./chat-room.resolver";
import { ChatRoomService } from "./chat-room.service";
import { ChatRoomRepository } from "./chat-room.repository";

@Module({
	imports: [AppDatabaseModule],
	providers: [generateMongoProvider(Room), ChatRoomResolver, ChatRoomService, ChatRoomRepository],
})
export class ChatRoomModule {}
