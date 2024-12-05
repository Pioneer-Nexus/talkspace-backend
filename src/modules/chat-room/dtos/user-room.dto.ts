import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { Types } from "mongoose";
import { UserRoom } from "../schemas/user-room.schema";

@InputType()
export class UserRoomInputDTO {
	@Field(() => String, { nullable: false })
	user: Types.ObjectId;
}

@ObjectType()
export class UserRoomDto extends PickType(
	UserRoom,
	["_id", "user", "room", "isNotify", "lastSeen", "muteUntil", "role"],
	ObjectType,
) {}
