import { PaginationOptionDto } from "@/core/dto/pagination-option.dto";
import { CurrentUser, JwtAuthGuard } from "@/modules/auth";
import { CurrentUserDto } from "@/modules/auth/dtos/current-auth.dto";
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateMessageInput } from "../dtos/create-message.input";
import { MessageDto } from "../dtos/message.dto";
import { PaginatedMessageDto } from "../dtos/paginated-message.dto";
import { MessageService } from "../services/message.service";

@Resolver(() => MessageDto)
@UseGuards(JwtAuthGuard)
export class MessageResolver {
	constructor(private readonly messageService: MessageService) {}

	@Mutation(() => MessageDto)
	createMessage(@CurrentUser() user: CurrentUserDto, @Args("input") createMessageInput: CreateMessageInput) {
		return this.messageService.create(createMessageInput, user.id);
	}

	@Query(() => PaginatedMessageDto, {
		name: "getRoomMessages",
		description: "Get paginated messages of a room by id of the room",
	})
	getRoomMessages(
		@Args("roomIdInput") roomId: string,
		@Args("paginationOptionInput") paginatedOption: PaginationOptionDto,
	): Promise<PaginatedMessageDto> {
		return this.messageService.getRoomMessages(roomId, paginatedOption);
	}
}
