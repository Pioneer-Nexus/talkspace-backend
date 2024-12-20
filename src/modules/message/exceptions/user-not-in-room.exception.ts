import EXCEPTION_MESSAGES from "@/core/constants/exception";
import { ApiForbiddenException } from "@/utils/exception";

export class UserNotInRoomException extends ApiForbiddenException {
	constructor() {
		super(EXCEPTION_MESSAGES.USER_NOT_IN_CHAT_ROOM.message, {
			code: EXCEPTION_MESSAGES.USER_NOT_IN_CHAT_ROOM.code,
		});
	}
}
