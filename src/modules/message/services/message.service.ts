import { messageJob } from "@/core/constants/jobs";
import { PaginationOptionDto } from "@/core/dto/pagination-option.dto";
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { Types } from "mongoose";
import { CreateMessageInput } from "../dtos/create-message.input";
import { MessageDto } from "../dtos/message.dto";
import { PaginatedMessageDto } from "../dtos/paginated-message.dto";
import { MessageRepository } from "../repositories/message.repository";

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

	async getRoomMessages(roomId: string, paginatedOption: PaginationOptionDto): Promise<PaginatedMessageDto> {
		const paginatedMessages = await this.messageRepository.findAll(
			{ roomId: new Types.ObjectId(roomId) },
			paginatedOption,
			{ sort: { _id: -1 } },
		);

		return paginatedMessages;
	}
}
