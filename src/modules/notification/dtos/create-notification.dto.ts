import { InputType, PickType } from "@nestjs/graphql";
import { Notification } from "../schemas/notification.schema";

@InputType()
export class CreateNotificationDto extends PickType(
	Notification,
	["title", "content", "data", "priority", "receiverUsers"],
	InputType,
) {}
