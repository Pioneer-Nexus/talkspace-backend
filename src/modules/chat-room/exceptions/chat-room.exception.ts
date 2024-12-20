import EXCEPTION_MESSAGES from "@/core/constants/exception";
import { ApiUnauthorizedException } from "@/utils/exception";

export class DontAllowToUpdateChatRoom extends ApiUnauthorizedException {
	constructor() {
		super(EXCEPTION_MESSAGES.DONT_ALLOW_TO_UPDATE_CHAT_ROOM.message, {
			code: EXCEPTION_MESSAGES.DONT_ALLOW_TO_UPDATE_CHAT_ROOM.code,
		});
	}
}
