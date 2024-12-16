import { PaginationOptionDto } from "@/core/dto/pagination-option.dto";
import { CurrentUserDto } from "@/modules/auth/dtos/current-auth.dto";
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { CurrentUser, JwtAuthGuard } from "../../auth";
import { ChatRoomDto } from "../dtos/chat-room.dto";
import { CreatedChatRoomDto, CreatedChatRoomResponseDto } from "../dtos/created-chat-room.dto";
import { PaginatedChatRoomDto } from "../dtos/paginated-chat-room.dto";
import { PaginatedUserRoomDto } from "../dtos/paginated-user-room.dto";
import { UpdatedChatRoomDto, UpdatedChatRoomResponseDto } from "../dtos/updated-chat-room.dto";
import { UserRoomDto } from "../dtos/user-room.dto";
import { ChatRoomService } from "../services/chat-room.service";
import { UserRoomService } from "../services/user-room.service";

@Resolver(() => ChatRoomDto)
@UseGuards(JwtAuthGuard)
export class ChatRoomResolver {
	constructor(
		private readonly chatRoomService: ChatRoomService,
		private readonly userRoomService: UserRoomService,
	) {}

	@Query(() => PaginatedChatRoomDto)
	async getUserChatRooms(
		@CurrentUser() user: CurrentUserDto,
		@Args("paginationOption", { nullable: true }) paginationOption: PaginationOptionDto,
	) {
		return await this.chatRoomService.findUserChatRoom(user, paginationOption);
	}

	@Query(() => PaginatedUserRoomDto)
	async getChatRoomPendingInvites(
		@CurrentUser() user: CurrentUserDto,
		@Args("roomId") roomId: string,
		@Args("paginationOption", { nullable: true }) paginationOption: PaginationOptionDto,
	) {
		return await this.chatRoomService.findAllPendingInvites(roomId, paginationOption);
	}

	@Mutation(() => CreatedChatRoomResponseDto)
	async createChatRoom(
		@Args("chatRoom") chatRoom: CreatedChatRoomDto,
		@CurrentUser() user: CurrentUserDto,
	): Promise<CreatedChatRoomResponseDto> {
		const result = await this.chatRoomService.create(user, chatRoom);
		return result;
	}

	@Mutation(() => UpdatedChatRoomResponseDto)
	async updateChatRoom(
		@Args("chatRoom") chatRoom: UpdatedChatRoomDto,
		@CurrentUser() user: CurrentUserDto,
	): Promise<UpdatedChatRoomResponseDto> {
		const result = await this.chatRoomService.update(user, chatRoom);
		return result;
	}

	@Mutation(() => ChatRoomDto)
	async addNewUserToChatRoom(@Args("userId") userId: string, @Args("roomId") roomId: string): Promise<ChatRoomDto> {
		return await this.chatRoomService.addNewUser(userId, roomId);
	}

	@Mutation(() => ChatRoomDto)
	async removeUserFromChatRoom(@Args("userId") userId: string, @Args("roomId") roomId: string): Promise<ChatRoomDto> {
		return await this.chatRoomService.removeUser(userId, roomId);
	}

	@Mutation(() => UserRoomDto)
	async acceptToJoinChatRoom(@Args("userId") userId: string, @Args("roomId") roomId: string): Promise<UserRoomDto> {
		return await this.chatRoomService.acceptToJoin(userId, roomId);
	}

	@Mutation(() => String)
	async removeChatRoom(@Args("id") id: string): Promise<string> {
		const result = await this.chatRoomService.remove(id);
		return result;
	}

	@ResolveField(() => [UserRoomDto])
	async userRooms(@Parent() chatRoomResponse: UpdatedChatRoomResponseDto) {
		return await this.userRoomService.findByRoomId(chatRoomResponse._id.toString());
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
