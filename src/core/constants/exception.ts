export type ExceptionDto = {
	message: string;
	code: string;
};

const EXCEPTION_MESSAGES: Record<string, ExceptionDto> = {
	USER_NOT_FOUND_IN_CHAT_ROOM: {
		message: "User is not found in chat room",
		code: "USER_NOT_FOUND_IN_CHAT_ROOM",
	},
};

export default EXCEPTION_MESSAGES;
