import { Injectable } from "@nestjs/common";
import { CreateMessageInput } from "../dtos/create-message.input";
import { MessageDto } from "../dtos/message.dto";
import { MessageRepository } from "../repositories/message.repository";

@Injectable()
export class MessageService {
	constructor(private readonly messageRepository: MessageRepository) {}

	async create(createMessageInput: CreateMessageInput, userId: string): Promise<MessageDto> {
		const createdMessage = await this.messageRepository.createMessage({
			...createMessageInput,
			authorId: userId,
		});

		return createdMessage;
	}
}
