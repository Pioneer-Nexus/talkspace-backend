import { MongoRepository } from "@/core/repository";
import { MONGO_CONNECTION } from "@/infrastructures/database";
import { Inject, Injectable } from "@nestjs/common";
import { Connection, Model } from "mongoose";
import { UserDto } from "../../user/user.schema";
import { CreatedChatRoomDto, CreatedChatRoomResponseDto } from "../dtos/created-chat-room.dto";
import { Room, RoomDocument } from "../schemas/room.schema";
import { UserRoomRepository } from "./user-room.repository";
import { RoomRole } from "../schemas/user-room.schema";

@Injectable()
export class ChatRoomRepository extends MongoRepository<RoomDocument> {
	constructor(
		@Inject(Room.name) private readonly entity: Model<RoomDocument>,
		@Inject(MONGO_CONNECTION) connection: Connection,
		private readonly userRoomRepository: UserRoomRepository,
	) {
		super(entity, connection);
	}

	async createChatRoom(user: UserDto, roomData: CreatedChatRoomDto): Promise<CreatedChatRoomResponseDto> {
		return this.transaction(async (session) => {
			const room = new this.model({ ...roomData, webhooks: roomData.webhooks });
			const createdRoom = (await room.save({ session })).toObject();

			const userIds = Array.from(
				new Set([user._id, ...roomData.userRooms.map((userRoom) => userRoom.user)]).values(),
			);

			const userRooms = await this.userRoomRepository.insertMany(
				userIds.map((userId) => ({
					user: userId,
					room: room._id,
					role: userId == user._id ? RoomRole.ADMIN : RoomRole.MEMBER,
				})),
			);

			return {
				...createdRoom,
				userRooms: userRooms.map((d) => d.toObject()),
			};
		});
	}
}
