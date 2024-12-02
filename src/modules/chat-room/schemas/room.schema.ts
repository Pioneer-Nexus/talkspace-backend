import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Webhook } from "./webhook.schema";

export enum RoomType {
	PUBLIC = "PUBLIC",
	PRIVATE = "PRIVATE",
}

registerEnumType(RoomType, {
	name: "RoomType",
});

@Schema({ timestamps: true })
@ObjectType()
export class Room {
	@Prop()
	@Field({ nullable: false })
	name: string;

	@Prop({ enum: Object.values(RoomType), default: RoomType.PRIVATE })
	@Field(() => RoomType, { nullable: false })
	status: RoomType;

	@Prop()
	@Field({ nullable: true })
	type?: string;

	@Prop()
	@Field({ nullable: true })
	imageUrl?: string;

	@Prop()
	@Field(() => [Webhook], { nullable: false, defaultValue: [] })
	webhooks: Webhook[];
}

export type RoomDocument = HydratedDocument<Room>;

export const RoomSchema = SchemaFactory.createForClass(Room);
