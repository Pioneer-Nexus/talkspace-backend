import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateNotificationDto } from "../dtos/create-notification.dto";
import { NotificationDto } from "../dtos/notification.dto";
import { NotificationService } from "../services/notification.service";

@Resolver(() => NotificationDto)
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@Mutation(() => NotificationDto)
	async sendNotification(
		@Args("notification", { type: () => CreateNotificationDto }) notificationDto: CreateNotificationDto,
	) {
		return await this.notificationService.create(notificationDto);
	}
}
