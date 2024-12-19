import { Field, InputType, PickType } from "@nestjs/graphql";
import { Message } from "../schemas/message.schema";

@InputType()
export class CreateMessageInput extends PickType(Message, ["content", "isTagAll"], InputType) {
	@Field(() => [String], { nullable: true })
	files?: string[];

	@Field(() => String, { nullable: false })
	roomId: string;

	@Field(() => String, { nullable: true })
	quoteMessageId?: string;

	@Field(() => [String], { nullable: true, defaultValue: [] })
	tagUsers?: string[];

	authorId: string;
}
