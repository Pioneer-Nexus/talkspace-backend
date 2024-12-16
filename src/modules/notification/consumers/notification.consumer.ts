import { notificationJob } from "@/core/constants/jobs";
import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";

@Processor(notificationJob.name)
export class NotificationConsumer {
	@Process(notificationJob.events.NEW_NOTIFICATION)
	async transcode(job: Job<unknown>) {
		console.log("Processing...");
		console.log({ job });
		return {};
	}
}
