import { Injectable } from "@nestjs/common";
import { ChatRoomRepository } from "./chat-room.repository";
import { CreatedChatRoomDto } from "./dtos/created-chat-room.dto";
import { UserDto } from "../user/user.schema";

@Injectable()
export class ChatRoomService {
	constructor(private readonly chatRoomRepository: ChatRoomRepository) {}

	async create(user: UserDto, room: CreatedChatRoomDto) {
		return await this.chatRoomRepository.createChatRoom(user, room);
	}
}
