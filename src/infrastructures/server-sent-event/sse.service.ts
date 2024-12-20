import { NotificationType } from "@/modules/notification/schemas/notification.schema";
import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { ISseService } from "./sse.adapter";

@Injectable()
export class SseService extends ISseService {
	private subjects = new Map<string, Subject<any>>();

	addClient(userId: string, subject: Subject<any>) {
		this.subjects.set(userId, subject);
	}

	removeClient(userId: string) {
		this.subjects.delete(userId);
	}

	sendMessageToUser(userId: string, type: NotificationType, data: any) {
		const subject = this.subjects.get(userId);
		if (!subject) return false;
		subject.next({ type, data });
		return true;
	}
}
