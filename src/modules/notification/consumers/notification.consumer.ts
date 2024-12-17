import { notificationJob } from "@/core/constants/jobs";
import { ILoggerService } from "@/infrastructures/logger";
import { ISseService } from "@/infrastructures/server-sent-event/sse.adapter";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { SingleNotificationDto } from "../dtos/single-notification.dto";
import { NotificationRepository } from "../repositories/notification.repository";
import { NotificationStatus } from "../schemas/notification.schema";

@Processor(notificationJob.name)
export class NotificationConsumer {
	constructor(
		private readonly notificationRepository: NotificationRepository,
		private readonly sseService: ISseService,
		private readonly logger: ILoggerService,
	) {}

	@Process(notificationJob.events.NEW_NOTIFICATION)
	async newNotification(job: Job<SingleNotificationDto>) {
		const notification = job.data;
		await this.notificationRepository.findOneAndUpdate(
			{ _id: notification._id },
			{ status: NotificationStatus.SENDING },
		);

		const isSent = this.sseService.sendMessageToUser(notification.userId, notification);

		await this.notificationRepository.findOneAndUpdate(
			{ _id: notification._id },
			{ status: isSent ? NotificationStatus.SENT : NotificationStatus.FAIL },
		);

		if (isSent) {
			return { success: true };
		} else {
			throw new Error(notificationJob.errors.USER_NOT_CONNECTED);
		}
	}
}
