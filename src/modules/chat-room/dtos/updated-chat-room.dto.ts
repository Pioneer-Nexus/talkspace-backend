import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { Types } from "mongoose";
import { Room, RoomType } from "../schemas/room.schema";

@InputType()
export class UpdatedChatRoomDto extends PickType(Room, ["_id", "imageUrl", "name", "status", "type"], InputType) {
	@Field({ nullable: true })
	name: string;

	@Field(() => RoomType, { nullable: true })
	status: RoomType;

	@Field({ nullable: true })
	type?: string;

	@Field({ nullable: true })
	imageUrl?: string;
}

@ObjectType()
export class UpdatedChatRoomResponseDto extends PickType(
	Room,
	["_id", "createdAt", "imageUrl", "name", "status", "type", "updatedAt"],
	ObjectType,
) {
	userRooms: (string | Types.ObjectId)[];
}
