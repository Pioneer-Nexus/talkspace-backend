import { BaseDocument } from "@/core/entity/base-document";
import { BaseEntity } from "@/core/entity/base-entity";
import { User } from "@/modules/user/user.schema";
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GraphQLDateTimeISO } from "graphql-scalars";
import JSON from "graphql-type-json";
import { HydratedDocument, Types } from "mongoose";

export enum NotificationPriority {
	HIGH = "HIGH",
	NORMAL = "NORMAL",
	LOW = "LOW",
}

registerEnumType(NotificationPriority, {
	name: "NotificationPriority",
});

@Schema({ timestamps: true })
@ObjectType()
export class Notification extends BaseEntity {
	@Prop({ required: true })
	@Field({ nullable: false })
	title: string;

	@Prop()
	@Field({ nullable: true })
	content?: string;

	@Prop({ default: false })
	@Field(() => Boolean, { nullable: true, defaultValue: false })
	isSent?: boolean;

	@Prop({ type: () => Date })
	@Field(() => GraphQLDateTimeISO, { nullable: true })
	notifyDate?: Date;

	@Prop({ type: Object })
	@Field(() => JSON, { nullable: true })
	data: any;

	@Prop({ default: NotificationPriority.NORMAL })
	@Field(() => NotificationPriority, { nullable: true, defaultValue: NotificationPriority.NORMAL })
	priority?: string;

	@Prop({ type: [Types.ObjectId], ref: "User", required: true, default: [] })
	receiverUsers: Types.ObjectId[] | User[];
}

export type NotificationDocument = HydratedDocument<Notification> & BaseDocument;

export const NotificationSchema = SchemaFactory.createForClass(Notification);
