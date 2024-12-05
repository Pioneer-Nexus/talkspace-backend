import { ApiUnauthorizedException } from "@/utils/exception";

export class DontAllowToUpdateChatRoom extends ApiUnauthorizedException {
	constructor() {
		super(`Don't have permission to update this`);
	}
}
