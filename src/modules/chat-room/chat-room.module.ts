import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { Room } from "./schemas/room.schema";

@Module({
	providers: [generateMongoProvider(Room)],
})
export class ChatRoomModule {}
