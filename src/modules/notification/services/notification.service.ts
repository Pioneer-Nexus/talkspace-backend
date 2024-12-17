import { notificationJob } from "@/core/constants/jobs";
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { Types } from "mongoose";
import { CreateNotificationDto } from "../dtos/create-notification.dto";
import { NotificationRepository } from "../repositories/notification.repository";
import { NotificationStatus } from "../schemas/notification.schema";

@Injectable()
export class NotificationService {
	constructor(
		private readonly notificationRepository: NotificationRepository,
		@InjectQueue(notificationJob.name) private notificationQueue: Queue,
	) {}

	async create(data: CreateNotificationDto) {
		const { receiverUsers, ...notification } = (
			await this.notificationRepository.create({
				...data,
				status: NotificationStatus.WAITING,
				receiverUsers: data.receiverUsers.map((d) => new Types.ObjectId(d)),
			})
		).toObject();

		const delay = notification.notifyDate ? notification.notifyDate.getTime() - new Date().getTime() : 0;

		receiverUsers.map((user: any) => {
			this.notificationQueue.add(
				notificationJob.events.NEW_NOTIFICATION,
				{ ...notification, userId: user.toString() },
				{ delay },
			);
		});

		return notification;
	}
}
