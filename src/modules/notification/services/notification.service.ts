import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "../dtos/create-notification.dto";
import { NotificationRepository } from "../repositories/notification.repository";

@Injectable()
export class NotificationService {
	constructor(private readonly notificationRepository: NotificationRepository) {}

	async create(data: CreateNotificationDto) {
		return await this.notificationRepository.create(data);
	}
}
