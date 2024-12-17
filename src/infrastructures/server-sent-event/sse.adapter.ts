import { Subject } from "rxjs";
import { SseEvent } from "./sse-event-type";

export abstract class ISseService {
	abstract addClient(userId: string, subject: Subject<any>): void;

	abstract removeClient(userId: string): void;

	abstract sendMessageToUser(userId: string, type: SseEvent, message: any): boolean;
}
