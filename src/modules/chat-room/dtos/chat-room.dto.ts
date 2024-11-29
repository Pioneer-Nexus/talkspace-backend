import { ObjectType, OmitType } from "@nestjs/graphql";
import { Room } from "../schemas/room.schema";

export class ChatRoomDto extends OmitType(Room, [], ObjectType) {}
