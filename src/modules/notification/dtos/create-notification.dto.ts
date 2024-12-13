import { ObjectType, PickType } from "@nestjs/graphql";
import { Notification } from "../schemas/notification.schema";

export class CreateNotificationDto extends PickType(
	Notification,
	["title", "content", "data", "priority", "receiverUsers"],
	ObjectType,
) {}
