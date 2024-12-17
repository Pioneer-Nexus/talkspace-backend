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

		const delay = notification.notifyDate ? notification.notifyDate.getTime() - new Date().getTime() : 0;

		notification.receiverUsers.map((user: any) => {
			this.notificationQueue.add(
				notificationJob.events.NEW_NOTIFICATION,
				{ ...notification, userId: user.toString() },
				{ delay },
			);
		});

		return notification;
	}
}
