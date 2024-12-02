import { Field, InputType, ObjectType, OmitType, PickType } from "@nestjs/graphql";
import { Room } from "../schemas/room.schema";
import { Webhook } from "../schemas/webhook.schema";

@InputType()
export class WebhookInputDTO extends PickType(Webhook, ["id", "name"], InputType) {}

@InputType()
export class CreatedChatRoomDto extends OmitType(Room, ["webhooks"], InputType) {
	@Field(() => [WebhookInputDTO])
	webhooks: WebhookInputDTO[];
}

@ObjectType()
export class CreatedChatRoomResponseDto extends OmitType(Room, [], ObjectType) {}
