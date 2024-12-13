import { ObjectType, PickType } from "@nestjs/graphql";
import { Notification } from "../schemas/notification.schema";

@ObjectType()
export class NotificationDto extends PickType(
	Notification,
	['_id'],
	ObjectType,
) {}
