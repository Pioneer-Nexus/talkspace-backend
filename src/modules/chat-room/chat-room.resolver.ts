import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { ChatRoomService } from "./chat-room.service";
import { CreatedChatRoomDto, CreatedChatRoomResponseDto } from "./dtos/created-chat-room.dto";

@Resolver()
export class ChatRoomResolver {
	constructor(private readonly chatRoomService: ChatRoomService) {}

	@Mutation(() => CreatedChatRoomResponseDto)
	async createChatRoom(@Args("chatRoom") chatRoom: CreatedChatRoomDto): Promise<CreatedChatRoomResponseDto> {
		const result = await this.chatRoomService.create(chatRoom);
		return result;
	}
}
