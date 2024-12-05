import { Injectable } from "@nestjs/common";
import { UserDto } from "../../user/user.schema";
import { CreatedChatRoomDto } from "../dtos/created-chat-room.dto";
import { UpdatedChatRoomDto, UpdatedChatRoomResponseDto } from "../dtos/updated-chat-room.dto";
import { ChatRoomRepository } from "../repositories/chat-room.repository";

@Injectable()
export class ChatRoomService {
	constructor(private readonly chatRoomRepository: ChatRoomRepository) {}

	async create(user: UserDto, room: CreatedChatRoomDto) {
		return await this.chatRoomRepository.createChatRoom(user, room);
	}

	async update(user: UserDto, room: UpdatedChatRoomDto): Promise<UpdatedChatRoomResponseDto> {
		return await this.chatRoomRepository.updateChatRoom(room);
	}

	async findById(id: string) {
		return await this.chatRoomRepository.findById(id);
	}
}
