import { MongoRepository } from "@/core/repository";
import { MONGO_CONNECTION } from "@/infrastructures/database";
import { Inject, Injectable } from "@nestjs/common";
import { Connection, Model, Types } from "mongoose";
import { CreateMessageInput } from "../dtos/create-message.input";
import { MessageDto } from "../dtos/message.dto";
import { Message, MessageDocument } from "../schemas/message.schema";

@Injectable()
export class MessageRepository extends MongoRepository<MessageDocument> {
	constructor(
		@Inject(Message.name) private readonly entity: Model<MessageDocument>,
		@Inject(MONGO_CONNECTION) connection: Connection,
	) {
		super(entity, connection);
	}

	createMessage(createMessageInput: CreateMessageInput): Promise<MessageDto> {
		return this.create({
			...createMessageInput,
			files: createMessageInput.files?.map((file) => new Types.ObjectId(file)) ?? [],
			roomId: new Types.ObjectId(createMessageInput.roomId),
			quoteMessageId: createMessageInput.quoteMessageId
				? new Types.ObjectId(createMessageInput.quoteMessageId)
				: null,
			authorId: new Types.ObjectId(createMessageInput.authorId),
			tagUsers: createMessageInput.tagUsers?.map((tagUser) => new Types.ObjectId(tagUser)) ?? [],
		});
	}
}
