import { BaseEntity } from "@/core/entity/base-entity";
import { User } from "@/modules/user/user.schema";
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Room } from "./room.schema";
import { BaseDocument } from "@/core/entity/base-document";

export enum RoomRole {
	ADMIN = "ADMIN",
	MEMBER = "MEMBER",
	PENDING_INVITE = "PENDING_INVITE",
	VIEWER = "VIEWER",
}

registerEnumType(RoomRole, {
	name: "RoomRole",
});

@Schema({ timestamps: true })
@ObjectType()
export class UserRoom extends BaseEntity {
	@Prop({ type: Types.ObjectId, ref: "User", required: true })
	user: Types.ObjectId | User;

	@Prop({ type: Types.ObjectId, ref: "Room", required: true })
	room: Types.ObjectId | Room;

	@Prop({ type: () => Date, required: false })
	@Field(() => Date, { nullable: true })
	lastSeen?: Date;

	@Prop({ type: () => Boolean, default: true })
	@Field(() => Boolean, { nullable: false, defaultValue: true })
	isNotify?: boolean;

	@Prop({ type: () => Date })
	@Field(() => Date, { nullable: true })
	muteUntil?: Date;

	@Prop({ enum: Object.values(RoomRole), default: RoomRole.MEMBER })
	@Field(() => RoomRole, { nullable: false })
	role: RoomRole;
}

export type UserRoomDocument = HydratedDocument<UserRoom> & BaseDocument;

export const UserRoomSchema = SchemaFactory.createForClass(UserRoom);
