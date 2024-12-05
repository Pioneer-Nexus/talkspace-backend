import { CurrentAuthDto } from "@/modules/auth/dtos/current-auth.dto";
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CurrentUser, JwtAuthGuard } from "../../auth";
import { CreatedChatRoomDto, CreatedChatRoomResponseDto } from "../dtos/created-chat-room.dto";
import { ChatRoomService } from "../services/chat-room.service";

@Resolver()
@UseGuards(JwtAuthGuard)
export class ChatRoomResolver {
	constructor(private readonly chatRoomService: ChatRoomService) {}

	@Mutation(() => CreatedChatRoomResponseDto)
	async createChatRoom(
		@Args("chatRoom") chatRoom: CreatedChatRoomDto,
		@CurrentUser() auth: CurrentAuthDto,
	): Promise<CreatedChatRoomResponseDto> {
		const result = await this.chatRoomService.create(auth.user, chatRoom);
		return result;
	}
}
