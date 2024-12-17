import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "../dtos/create-notification.dto";
import { NotificationRepository } from "../repositories/notification.repository";
import { InjectQueue } from "@nestjs/bull";
import { notificationJob } from "@/core/constants/jobs";
import { Queue } from "bull";
import { NotificationStatus } from "../schemas/notification.schema";

@Injectable()
export class NotificationService {
	constructor(
		private readonly notificationRepository: NotificationRepository,
		@InjectQueue(notificationJob.name) private notificationQueue: Queue,
	) {}

	async create(data: CreateNotificationDto) {
		const notification = await this.notificationRepository.create({
			...data,
			status: NotificationStatus.WAITING,
		});

		this.notificationQueue.add(notificationJob.events.NEW_NOTIFICATION, notification);

		return notification;
	}
}
