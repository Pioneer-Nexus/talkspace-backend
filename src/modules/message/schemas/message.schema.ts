import { BaseDocument } from "@/core/entity/base-document";
import { BaseEntity } from "@/core/entity/base-entity";
import { Room } from "@/modules/chat-room/schemas/room.schema";
import { User } from "@/modules/user/schemas/user.schema";
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export enum MessageType {
	MESSAGE = "MESSAGE",
	FILE = "FILE",
	VIDEO = "VIDEO",
	IMAGE = "IMAGE",
	AUDIO = "AUDIO",
}

export enum MessageStatus {
	SENT = "SENT",
	REMOVED = "REMOVED",
	SEEN = "SEEN",
	EDIT = "EDIT",
	SENDING = "SENDING",
}

registerEnumType(MessageStatus, {
	name: "MessageStatus",
});

registerEnumType(MessageType, {
	name: "MessageType",
});

@Schema({ timestamps: true })
@ObjectType()
export class Message extends BaseEntity {
	@Prop()
	@Field({ nullable: false })
	content: string;

	@Prop({ enum: Object.values(MessageStatus), default: MessageStatus.SENDING })
	@Field(() => MessageStatus, { nullable: false })
	status: string;

	@Prop({ enum: Object.values(MessageType), default: MessageType.MESSAGE })
	@Field(() => MessageType, { nullable: false })
	type: string;

	@Prop({ type: [Types.ObjectId], ref: "File" })
	files: (Types.ObjectId | File)[];

	@Prop({ type: Types.ObjectId, ref: "Room" })
	@Field(() => String, { nullable: false })
	roomId: Types.ObjectId | Room;

	@Prop({ type: [Types.ObjectId], ref: "User" })
	seenUsers: (Types.ObjectId | User)[];

	@Prop({ type: Types.ObjectId, ref: "User" })
	@Field(() => String, { nullable: false })
	authorId: Types.ObjectId | User;

	@Prop({ type: [Types.ObjectId], ref: "User", default: [] })
	@Field(() => [String], { nullable: true, defaultValue: [] })
	tagUsers: (Types.ObjectId | User)[];

	@Prop({ type: Boolean, default: false })
	@Field(() => Boolean, { nullable: true, defaultValue: false })
	isTagAll: boolean;

	@Prop({ type: Types.ObjectId, ref: "Message" })
	@Field(() => String, { nullable: true })
	quoteMessageId?: Types.ObjectId | Message;
}

export type MessageDocument = HydratedDocument<Message> & BaseDocument;

export const MessageSchema = SchemaFactory.createForClass(Message);
