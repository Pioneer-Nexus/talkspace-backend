import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { UserRoom } from "./user-room.schema";
import { Webhook } from "./webhook.schema";
import { BaseEntity } from "@/core/entity/base-entity";

export enum RoomType {
	PUBLIC = "PUBLIC",
	PRIVATE = "PRIVATE",
}

registerEnumType(RoomType, {
	name: "RoomType",
});

@Schema({ timestamps: true })
@ObjectType()
export class Room extends BaseEntity {
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
	webhooks: Webhook[];

	@Prop({ type: [{ type: Types.ObjectId, ref: "UserRoom" }] })
	userRooms: (Types.ObjectId | UserRoom)[];
}

export type RoomDocument = HydratedDocument<Room>;

export const RoomSchema = SchemaFactory.createForClass(Room);
