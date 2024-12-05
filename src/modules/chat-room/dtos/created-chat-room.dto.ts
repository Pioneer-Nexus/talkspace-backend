import { Field, InputType, ObjectType, OmitType, PickType } from "@nestjs/graphql";
import { Room } from "../schemas/room.schema";
import { UserRoomDto, UserRoomInputDTO } from "./user-room.dto";
import { WebhookInputDTO } from "./webhook.dto";

@InputType()
export class CreatedChatRoomDto extends OmitType(
	Room,
	["webhooks", "userRooms", "createdAt", "updatedAt", "_id"],
	InputType,
) {
	@Field(() => [WebhookInputDTO])
	webhooks: WebhookInputDTO[];

	@Field(() => [UserRoomInputDTO])
	userRooms: UserRoomInputDTO[];
}

@ObjectType()
export class CreatedChatRoomResponseDto extends PickType(
	Room,
	["_id", "createdAt", "imageUrl", "name", "status", "type", "updatedAt"],
	ObjectType,
) {
	@Field(() => [UserRoomDto])
	userRooms: UserRoomDto[];
}
