import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ChatRoomService } from "./chat-room.service";
import { CreatedChatRoomDto } from "./dtos/created-chat-room.dto";

@Resolver()
export class ChatRoomResolver {
	constructor(private readonly chatRoomService: ChatRoomService) {}

	@Mutation()
	async createChatRoom(@Args() chatRoom: CreatedChatRoomDto) {
		const result = await this.chatRoomService.create(chatRoom);
		return result;
	}
}
