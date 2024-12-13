import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";

@Injectable()
export class SseService {
	private subjects = new Map<string, Subject<any>>();

	addClient(userId: string, subject: Subject<any>) {
		this.subjects.set(userId, subject);
	}

	removeClient(userId: string) {
		this.subjects.delete(userId);
	}

	sendMessageToUser(userId: string, data: any) {
		const subject = this.subjects.get(userId);
		if (!subject) return false;
		subject.next({ data });
		return true;
	}
}
