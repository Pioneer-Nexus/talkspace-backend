import { ObjectType, PickType } from "@nestjs/graphql";
import { Message } from "../schemas/message.schema";

@ObjectType()
export class MessageDto extends PickType(
	Message,
	[
		"_id",
		"content",
		"createdAt",
		"deletedAt",
		"files",
		"isTagAll",
		"quoteMessageId",
		"roomId",
		"seenUsers",
		"authorId",
		"status",
	],
	ObjectType,
) {}
