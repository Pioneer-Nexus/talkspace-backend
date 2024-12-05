import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { UserDto } from "../../user/user.schema";
import { CreatedChatRoomDto } from "../dtos/created-chat-room.dto";
import { UpdatedChatRoomDto, UpdatedChatRoomResponseDto } from "../dtos/updated-chat-room.dto";
import { DontAllowToUpdateChatRoom } from "../exceptions/chat-room.exception";
import { ChatRoomRepository } from "../repositories/chat-room.repository";
import { UserRoomRepository } from "../repositories/user-room.repository";
import { RoomRole } from "../schemas/user-room.schema";

@Injectable()
export class ChatRoomService {
	constructor(
		private readonly chatRoomRepository: ChatRoomRepository,
		private readonly userRoomRepository: UserRoomRepository,
	) {}

	async create(user: UserDto, room: CreatedChatRoomDto) {
		return await this.chatRoomRepository.createChatRoom(user, room);
	}

	async update(user: UserDto, room: UpdatedChatRoomDto): Promise<UpdatedChatRoomResponseDto> {
		const userRoom = await this.userRoomRepository.findOne({
			room: new Types.ObjectId(room._id),
			user: new Types.ObjectId(user._id),
			role: RoomRole.ADMIN,
		});

		if (!userRoom) throw new DontAllowToUpdateChatRoom();

		return await this.chatRoomRepository.updateChatRoom(room);
	}

	async findById(id: string) {
		return await this.chatRoomRepository.findById(id);
	}
}
