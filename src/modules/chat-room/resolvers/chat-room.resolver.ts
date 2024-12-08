import { CurrentAuthDto } from "@/modules/auth/dtos/current-auth.dto";
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { CurrentUser, JwtAuthGuard } from "../../auth";
import { CreatedChatRoomDto, CreatedChatRoomResponseDto } from "../dtos/created-chat-room.dto";
import { UpdatedChatRoomDto, UpdatedChatRoomResponseDto } from "../dtos/updated-chat-room.dto";
import { UserRoomDto } from "../dtos/user-room.dto";
import { ChatRoomService } from "../services/chat-room.service";
import { UserRoomService } from "../services/user-room.service";

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

	@Mutation(() => UpdatedChatRoomResponseDto)
	async updateChatRoom(
		@Args("chatRoom") chatRoom: UpdatedChatRoomDto,
		@CurrentUser() auth: CurrentAuthDto,
	): Promise<UpdatedChatRoomResponseDto> {
		const result = await this.chatRoomService.update(auth.user, chatRoom);
		return result;
	}

	@Mutation(() => String)
	async removeChatRoom(@Args("id") id: string): Promise<string> {
		const result = await this.chatRoomService.remove(id);
		return result;
	}
}

@Resolver(() => UpdatedChatRoomResponseDto)
export class UpdatedChatRoomResponseDtoResolver {
	constructor(private readonly userRoomService: UserRoomService) {}

	@ResolveField(() => [UserRoomDto])
	async userRooms(@Parent() chatRoomResponse: UpdatedChatRoomResponseDto) {
		return await this.userRoomService.findByRoomId(chatRoomResponse._id.toString());
	}
}
