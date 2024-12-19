import { messageJob } from "@/core/constants/jobs";
import { NOTIFICATION_MESSAGES } from "@/core/constants/notification-message";
import { ChatRoomService } from "@/modules/chat-room/services/chat-room.service";
import { CreateNotificationDto } from "@/modules/notification/dtos/create-notification.dto";
import { NotificationType } from "@/modules/notification/schemas/notification.schema";
import { NotificationService } from "@/modules/notification/services/notification.service";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { MessageDto } from "../dtos/message.dto";

@Processor(messageJob.name)
export class MessageNotifyConsumer {
	constructor(
		private readonly notificationService: NotificationService,
		private readonly chatRoomService: ChatRoomService,
	) {}

	@Process(messageJob.events.NEW_MESSAGE)
	async handleNewMessage(job: Job<MessageDto>) {
		const message = job.data;

		const userList = await this.chatRoomService.findAllMembers(message.roomId.toString(), {
			pageSize: 1000,
			page: 0,
		});

		await Promise.all(
			userList.map(async (userId) => {
				const isTagged = message.tagUsers.map((d) => d.toString()).includes(userId) || message.isTagAll;
				const notificationData: CreateNotificationDto = {
					title: NOTIFICATION_MESSAGES.NEW_MESSAGE,
					content: message.content,
					receiverUsers: [userId],
					data: message,
					type: isTagged ? NotificationType.NEW_MESSAGE_TAGGED : NotificationType.NEW_MESSAGE,
				};
				await this.notificationService.create(notificationData);
			}),
		);
	}
}
