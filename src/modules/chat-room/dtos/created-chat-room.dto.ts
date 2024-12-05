import { Field, InputType, ObjectType, OmitType, PickType } from "@nestjs/graphql";
import { Room } from "../schemas/room.schema";
import { Webhook } from "../schemas/webhook.schema";
import { UserRoomInputDTO } from "./user-room.dto";

@InputType()
export class WebhookInputDTO extends PickType(Webhook, ["id", "name"], InputType) {}

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
export class CreatedChatRoomResponseDto extends OmitType(Room, [], ObjectType) {}
