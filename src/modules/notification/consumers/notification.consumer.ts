import { notificationJob } from "@/core/constants/jobs";
import { ILoggerService } from "@/infrastructures/logger";
import { ISseService } from "@/infrastructures/server-sent-event/sse.adapter";
import { User } from "@/modules/user/schemas/user.schema";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Types } from "mongoose";
import { NotificationDto } from "../dtos/notification.dto";
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
	async newNotification(job: Job<NotificationDto>) {
		const notification = job.data;
		await this.notificationRepository.findOneAndUpdate(
			{ _id: notification._id },
			{ status: NotificationStatus.SENDING },
		);

		try {
			await Promise.all(
				notification.receiverUsers.map(async (userId: Types.ObjectId | User) => {
					const isSent = this.sseService.sendMessageToUser(userId.toString(), notification);
					await this.notificationRepository.findOneAndUpdate(
						{ _id: notification._id },
						{ status: isSent ? NotificationStatus.SENT : NotificationStatus.FAIL },
					);
				}),
			);
		} catch (error: unknown) {
			this.logger.error("Fail to send notification", { error });
		}

		return {};
	}
}
