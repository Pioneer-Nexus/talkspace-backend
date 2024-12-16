import { notificationJob } from "@/core/constants/jobs";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { NotificationDto } from "../dtos/notification.dto";

@Processor(notificationJob.name)
export class NotificationConsumer {
	@Process(notificationJob.events.NEW_NOTIFICATION)
	async newNotification(job: Job<NotificationDto>) {
		return {};
	}
}
