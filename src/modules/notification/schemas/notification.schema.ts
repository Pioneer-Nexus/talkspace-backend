import { BaseDocument } from "@/core/entity/base-document";
import { BaseEntity } from "@/core/entity/base-entity";
import { User } from "@/modules/user/user.schema";
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
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

	@Prop({ type: Object })
	@Field(() => JSON, { nullable: true })
	data: any;

	@Prop()
	@Field(() => NotificationPriority, { nullable: true, defaultValue: NotificationPriority.NORMAL })
	priority?: string;

	@Prop({ type: Types.ObjectId, ref: "User", required: true })
	user: Types.ObjectId | User;
}

export type RoomDocument = HydratedDocument<Notification> & BaseDocument;

export const NotificationSchema = SchemaFactory.createForClass(Notification);
