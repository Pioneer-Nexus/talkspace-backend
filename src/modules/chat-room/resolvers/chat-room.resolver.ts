import { PaginationOptionDto } from "@/core/dto/pagination-option.dto";
import { CurrentAuthDto } from "@/modules/auth/dtos/current-auth.dto";
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { CurrentUser, JwtAuthGuard } from "../../auth";
import { CreatedChatRoomDto, CreatedChatRoomResponseDto } from "../dtos/created-chat-room.dto";
import { PaginatedChatRoomDto } from "../dtos/paginated-chat-room.dto";
import { UpdatedChatRoomDto, UpdatedChatRoomResponseDto } from "../dtos/updated-chat-room.dto";
import { UserRoomDto } from "../dtos/user-room.dto";
import { ChatRoomService } from "../services/chat-room.service";
import { UserRoomService } from "../services/user-room.service";
import { ChatRoomDto } from "../dtos/chat-room.dto";

@Resolver(() => ChatRoomDto)
@UseGuards(JwtAuthGuard)
export class ChatRoomResolver {
	constructor(
		private readonly chatRoomService: ChatRoomService,
		private readonly userRoomService: UserRoomService,
	) {}

	@Query(() => PaginatedChatRoomDto)
	async getUserChatRooms(
		@CurrentUser() auth: CurrentAuthDto,
		@Args("paginationOption", { nullable: true }) paginationOption: PaginationOptionDto,
	) {
		return await this.chatRoomService.findUserChatRoom(auth.user, paginationOption);
	}

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

	@Mutation(() => ChatRoomDto)
	async addNewUser(@Args("userId") userId: string, @Args("roomId") roomId: string): Promise<ChatRoomDto> {
		return await this.chatRoomService.addNewUser(userId, roomId);
	}

	@Mutation(() => ChatRoomDto)
	async removeUser(@Args("userId") userId: string, @Args("roomId") roomId: string): Promise<ChatRoomDto> {
		return await this.chatRoomService.removeUser(userId, roomId);
	}

	@Mutation(() => UserRoomDto)
	async acceptToJoin(@Args("userId") userId: string, @Args("roomId") roomId: string): Promise<UserRoomDto> {
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
