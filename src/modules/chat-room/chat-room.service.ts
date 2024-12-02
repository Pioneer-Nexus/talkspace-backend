import { Injectable } from "@nestjs/common";
import { ChatRoomRepository } from "./chat-room.repository";
import { CreatedChatRoomDto } from "./dtos/created-chat-room.dto";

@Injectable()
export class ChatRoomService {
	constructor(private readonly chatRoomRepository: ChatRoomRepository) {}

	async create(room: CreatedChatRoomDto) {
		return await this.chatRoomRepository.create({
			...room,
			webhooks: room.webhooks,
		});
	}
}
