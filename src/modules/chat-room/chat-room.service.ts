import { Injectable } from "@nestjs/common";
import { ChatRoomRepository } from "./chat-room.repository";
import { RoomDocument } from "./schemas/room.schema";

@Injectable()
export class ChatRoomService {
	constructor(private readonly chatRoomRepository: ChatRoomRepository) {}

	async create(room: Partial<RoomDocument>) {
		return await this.chatRoomRepository.create(room);
	}
}
