import { ObjectType, OmitType } from "@nestjs/graphql";
import { Room } from "../schemas/room.schema";

@ObjectType()
export class ChatRoomDto extends OmitType(Room, [], ObjectType) {}
