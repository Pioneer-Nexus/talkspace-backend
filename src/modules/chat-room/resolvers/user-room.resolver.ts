import { UserDto } from "@/modules/user/schemas/user.schema";
import { UserService } from "@/modules/user/user.service";
import { UseGuards } from "@nestjs/common";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { JwtAuthGuard } from "../../auth";
import { ChatRoomDto } from "../dtos/chat-room.dto";
import { UserRoomDto } from "../dtos/user-room.dto";
import { ChatRoomService } from "../services/chat-room.service";

@Resolver(() => UserRoomDto)
@UseGuards(JwtAuthGuard)
export class UserRoomResolver {
	constructor(
		private readonly chatRoomService: ChatRoomService,
		private readonly userService: UserService,
	) {}

	@ResolveField(() => ChatRoomDto)
	async room(@Parent() userRoom: UserRoomDto) {
		return await this.chatRoomService.findById(userRoom.room.toString());
	}

	@ResolveField(() => UserDto)
	async user(@Parent() userRoom: UserRoomDto) {
		return await this.userService.findById(userRoom.user.toString());
	}
}
