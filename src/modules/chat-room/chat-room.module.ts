import { AppDatabaseModule } from "@/infrastructures/database";
import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { ChatRoomRepository } from "./repositories/chat-room.repository";
import { UserRoomRepository } from "./repositories/user-room.repository";
import { ChatRoomResolver, UpdatedChatRoomResponseDtoResolver } from "./resolvers/chat-room.resolver";
import { UserRoomResolver } from "./resolvers/user-room.resolver";
import { Room } from "./schemas/room.schema";
import { UserRoom } from "./schemas/user-room.schema";
import { ChatRoomService } from "./services/chat-room.service";
import { UserRoomService } from "./services/user-room.service";

@Module({
	imports: [AppDatabaseModule, UserModule],
	providers: [
		generateMongoProvider(Room),
		generateMongoProvider(UserRoom),
		ChatRoomResolver,
		UserRoomResolver,
		UpdatedChatRoomResponseDtoResolver,
		ChatRoomService,
		UserRoomService,
		ChatRoomRepository,
		UserRoomRepository,
	],
})
export class ChatRoomModule {}
