import { ISseService } from "@/infrastructures/server-sent-event/sse.adapter";
import { JwtSseAuthGuard } from "@/modules/auth";
import { UserDto } from "@/modules/user/schemas/user.schema";
import { Controller, MessageEvent, Req, Res, Sse, UseGuards } from "@nestjs/common";
import { Observable, Subject } from "rxjs";

@Controller("notifications")
export class NotificationController {
	constructor(private readonly sseService: ISseService) {}

	@Sse("watch")
	@UseGuards(JwtSseAuthGuard)
	notification(@Req() req: any, @Res() res: any): Observable<MessageEvent> {
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
}
