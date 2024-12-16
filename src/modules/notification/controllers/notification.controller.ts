import { notificationJob } from "@/core/constants/jobs";
import { ISseService } from "@/infrastructures/server-sent-event/sse.adapter";
import { JwtSseAuthGuard } from "@/modules/auth";
import { UserDto } from "@/modules/user/user.schema";
import { InjectQueue } from "@nestjs/bull";
import { Controller, Get, MessageEvent, Req, Res, Sse, UseGuards } from "@nestjs/common";
import { Queue } from "bull";
import { Response } from "express";
import { Observable, Subject } from "rxjs";

@Controller("notifications")
export class NotificationController {
	constructor(
		private readonly sseService: ISseService,
		@InjectQueue("notification") private audioQueue: Queue,
	) {}

	@Sse("watch")
	@UseGuards(JwtSseAuthGuard)
	notification(@Req() req: any, @Res() res: Response): Observable<MessageEvent> {
		const user = req.user.user as UserDto;

		const subject = new Subject<any>();

		const userId = user._id.toString();

		this.sseService.addClient(userId, subject);

		res.on("close", () => {
			this.sseService.removeClient(userId);
			res.end();
		});

		return subject;
	}

	@Get("send")
	@UseGuards(JwtSseAuthGuard)
	send(@Req() req) {
		const user = req.user.user as UserDto;
		const userId = user._id.toString();
		const result = this.sseService.sendMessageToUser(userId, { a: 1, b: 2 });
		this.audioQueue.add(notificationJob.events.NEW_NOTIFICATION, { a: 1, b: 2 });
		return result;
	}
}
