import { NotificationType } from "@/modules/notification/schemas/notification.schema";
import { Subject } from "rxjs";

export abstract class ISseService {
	abstract addClient(userId: string, subject: Subject<any>): void;

	abstract removeClient(userId: string): void;

	abstract sendMessageToUser(userId: string, type: NotificationType, message: any): boolean;
}
