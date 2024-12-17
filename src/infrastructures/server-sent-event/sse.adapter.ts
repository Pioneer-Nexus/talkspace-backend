import { Subject } from "rxjs";

export abstract class ISseService {
	abstract addClient(userId: string, subject: Subject<any>): void;

	abstract removeClient(userId: string): void;

	abstract sendMessageToUser(userId: string, message: any): boolean;
}
