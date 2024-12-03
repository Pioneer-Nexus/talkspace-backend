import { User } from "@/modules/user/user.schema";
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Room } from "./room.schema";

export enum RoomRole {
	ADMIN = "ADMIN",
	MEMBER = "MEMBER",
	VIEWER = "VIEWER",
}

registerEnumType(RoomRole, {
	name: "RoomRole",
});

@Schema({ timestamps: true })
@ObjectType()
export class UserRoom {
	@Prop({ type: Types.ObjectId, ref: "User", required: true })
	user: Types.ObjectId | User;

	@Prop({ type: Types.ObjectId, ref: "Room", required: true })
	room: Types.ObjectId | Room;

	@Prop({ type: () => Date, required: true })
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

export type UserRoomDocument = HydratedDocument<UserRoom>;
