import { ObjectType, PickType } from "@nestjs/graphql";
import { Notification } from "../schemas/notification.schema";

export class SingleNotificationDto extends PickType(
	Notification,
	["_id", "title", "content", "data", "priority", "type"],
	ObjectType,
) {
	userId: string;
}
