import { Field, InputType, PickType } from "@nestjs/graphql";
import { Notification } from "../schemas/notification.schema";

@InputType()
export class CreateNotificationDto extends PickType(Notification, ["title", "content", "data", "priority"], InputType) {
	@Field(() => [String])
	receiverUsers: string[];
}
