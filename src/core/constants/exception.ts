export type ExceptionDto = {
	message: string;
	code: string;
};

const EXCEPTION_MESSAGES: Record<string, ExceptionDto> = {
	USER_NOT_FOUND_IN_CHAT_ROOM: {
		message: "User is not found in chat room",
		code: "USER_NOT_FOUND_IN_CHAT_ROOM",
	},
	USER_ALREADY_IN_CHAT_ROOM: {
		message: "User is already in chat room",
		code: "USER_ALREADY_IN_CHAT_ROOM",
	},
	DONT_ALLOW_TO_UPDATE_CHAT_ROOM: {
		message: "Don't have permission to update this chat room",
		code: "DONT_ALLOW_TO_UPDATE_CHAT_ROOM",
	},
	USER_NOT_IN_CHAT_ROOM: {
		message: "User is not in chat room, so you can't see its messages",
		code: "USER_NOT_IN_CHAT_ROOM",
	},
};

export default EXCEPTION_MESSAGES;
