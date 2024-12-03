import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CurrentUser, JwtAuthGuard } from "../auth";
import { UserDto } from "../user/user.schema";
import { ChatRoomService } from "./chat-room.service";
import { CreatedChatRoomDto, CreatedChatRoomResponseDto } from "./dtos/created-chat-room.dto";

@Resolver()
@UseGuards(JwtAuthGuard)
export class ChatRoomResolver {
	constructor(private readonly chatRoomService: ChatRoomService) {}

	@Mutation(() => CreatedChatRoomResponseDto)
	async createChatRoom(
		@Args("chatRoom") chatRoom: CreatedChatRoomDto,
		@CurrentUser() user: UserDto,
	): Promise<CreatedChatRoomResponseDto> {
		const result = await this.chatRoomService.create(user, chatRoom);
		return result;
	}
}
