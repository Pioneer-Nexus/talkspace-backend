import { ObjectType, OmitType } from "@nestjs/graphql";
import { Notification } from "../schemas/notification.schema";

@ObjectType()
export class NotificationDto extends OmitType(Notification, [], ObjectType) {}
