import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export enum RoomRole {
	ADMIN = "ADMIN",
	MEMBER = "MEMBER",
	VIEWER = "VIEWER",
}

@Schema({ timestamps: true })
@ObjectType()
export class UserRoom {
	@Prop({ type: Types.ObjectId, ref: "User", required: true })
	@Field({ nullable: false })
	userId: Types.ObjectId;

	@Prop({ type: () => Date, required: true })
	@Field(() => Date, { nullable: true })
	lastSeen: Date;

	@Prop({ type: () => Boolean })
	@Field(() => Boolean, { nullable: false, defaultValue: true })
	isNotify: boolean;

	@Prop({ type: () => Date })
	@Field(() => Date, { nullable: true })
	muteUntil: Date;

	@Prop({ enum: Object.values(RoomRole), default: RoomRole.MEMBER })
	@Field(() => RoomRole, { nullable: false })
	role: RoomRole;
}

export type UserRoomDocument = HydratedDocument<UserRoom>;
