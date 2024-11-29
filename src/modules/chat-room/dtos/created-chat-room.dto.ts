import { InputType, OmitType } from "@nestjs/graphql";
import { Room } from "../schemas/room.schema";

export class CreatedChatRoomDto extends OmitType(Room, [], InputType) {}
