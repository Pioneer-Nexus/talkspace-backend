import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateMessageInput } from "../dtos/create-message.input";
import { MessageDto } from "../dtos/message.dto";
import { MessageService } from "../services/message.service";
import { UseGuards } from "@nestjs/common";
import { CurrentUser, JwtAuthGuard } from "@/modules/auth";
import { CurrentUserDto } from "@/modules/auth/dtos/current-auth.dto";

@Resolver(() => MessageDto)
@UseGuards(JwtAuthGuard)
export class MessageResolver {
	constructor(private readonly messageService: MessageService) {}

	@Mutation(() => MessageDto)
	createMessage(@CurrentUser() user: CurrentUserDto, @Args("input") createMessageInput: CreateMessageInput) {
		return this.messageService.create(createMessageInput, user.id);
	}
}
