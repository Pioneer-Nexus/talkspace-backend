import { ObjectType, PickType } from "@nestjs/graphql";
import { Room } from "../schemas/room.schema";

@ObjectType()
export class ChatRoomDto extends PickType(
	Room,
	["_id", "createdAt", "deletedAt", "updatedAt", "imageUrl", "name", "status", "type"],
	ObjectType,
) {}
