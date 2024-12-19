import { Injectable } from "@nestjs/common";
import { CreateMessageInput } from "../dtos/create-message.input";
import { MessageDto } from "../dtos/message.dto";
import { MessageRepository } from "../repositories/message.repository";
import { InjectQueue } from "@nestjs/bull";
import { messageJob } from "@/core/constants/jobs";
import { Queue } from "bull";

@Injectable()
export class MessageService {
	constructor(
		private readonly messageRepository: MessageRepository,
		@InjectQueue(messageJob.name) private messageQueue: Queue,
	) {}

	async create(createMessageInput: CreateMessageInput, userId: string): Promise<MessageDto> {
		const createdMessage = await this.messageRepository.createMessage({
			...createMessageInput,
			authorId: userId,
		});

		this.messageQueue.add(messageJob.events.NEW_MESSAGE, createdMessage);

		return createdMessage;
	}
}
