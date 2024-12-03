import { MongoRepository } from "@/core/repository";
import { Inject, Injectable } from "@nestjs/common";
import { Model, Mongoose } from "mongoose";
import { UserDto } from "../user/user.schema";
import { CreatedChatRoomDto, CreatedChatRoomResponseDto } from "./dtos/created-chat-room.dto";
import { Room, RoomDocument } from "./schemas/room.schema";

@Injectable()
export class ChatRoomRepository extends MongoRepository<RoomDocument> {
	constructor(
		@Inject(Room.name) private readonly entity: Model<RoomDocument>,
		@Inject("DATABASE_CONNECTION") mongoose: Mongoose,
	) {
		super(entity, mongoose.connection);
	}

	async createChatRoom(user: UserDto, roomData: CreatedChatRoomDto): Promise<CreatedChatRoomResponseDto> {
		return this.transaction(async (session) => {
			const room = new this.model({ ...roomData, webhooks: roomData.webhooks });
			const createdRoom = await room.save({ session });

			return createdRoom;
		});
	}
}
