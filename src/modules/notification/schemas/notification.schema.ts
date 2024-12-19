import { BaseDocument } from "@/core/entity/base-document";
import { BaseEntity } from "@/core/entity/base-entity";
import { User } from "@/modules/user/schemas/user.schema";
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

export enum NotificationType {
	NOTIFICATION = "NOTIFICATION",
	NEW_MESSAGE = "NEW_MESSAGE",
	NEW_MESSAGE_TAGGED = "NEW_MESSAGE_TAGGED",
}

export enum NotificationStatus {
	WAITING = "WAITING",
	SENDING = "SENDING",
	SENT = "SENT",
	FAIL = "FAIL",
	RECEIVED = "RECEIVED",
	READ = "READ",
}

@Schema({ timestamps: true })
@ObjectType()
export class Notification extends BaseEntity {
	@Prop({ required: true })
	@Field({ nullable: false })
	title: string;

	@Prop()
	@Field({ nullable: true })
	content?: string;

	@Prop({ type: () => Date })
	@Field(() => GraphQLDateTimeISO, { nullable: true })
	notifyDate?: Date;

	@Prop({ type: Object })
	@Field(() => JSON, { nullable: true })
	data: any;

	@Prop({ default: NotificationStatus.WAITING })
	@Field(() => NotificationStatus, { nullable: true, defaultValue: NotificationStatus.WAITING })
	status?: string;

	@Prop({ default: NotificationType.NOTIFICATION })
	@Field(() => NotificationType, { nullable: true, defaultValue: NotificationType.NOTIFICATION })
	type?: NotificationType;

	@Prop({ default: NotificationPriority.NORMAL })
	@Field(() => NotificationPriority, { nullable: true, defaultValue: NotificationPriority.NORMAL })
	priority?: string;

	@Prop({ type: [Types.ObjectId], ref: "User", required: true, default: [] })
	receiverUsers: Types.ObjectId[] | User[];
}

registerEnumType(NotificationPriority, { name: "NotificationPriority" });

registerEnumType(NotificationStatus, { name: "NotificationStatus" });

registerEnumType(NotificationType, { name: "NotificationType" });

export type NotificationDocument = HydratedDocument<Notification> & BaseDocument;

export const NotificationSchema = SchemaFactory.createForClass(Notification);
