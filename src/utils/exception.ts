import ERROR_CODES from "@/constants/error-code";
import { HttpException, HttpStatus } from "@nestjs/common";

export type ErrorModel = {
	error: {
		code: string | number;
		traceid: string;
		context: string;
		message: string[];
		timestamp: string;
		path: string;
	};
};

type ParametersType = { [key: string]: unknown };

type MessageType = string | string[];

export class BaseException extends HttpException {
	traceid: string;
	stackTraceList: string[];
	date: string;
	readonly context: string;
	readonly statusCode: number;
	code?: string;
	readonly parameters: ParametersType;

	constructor(
		message: MessageType,
		status: HttpStatus,
		parameters?: ParametersType,
	) {
		super(message, status);

		this.stackTraceList = this.stack
			.split("\n")
			.slice(1)
			.map((d) => d.split(/\sat/).at(1))
			.filter((d) => d)
			.map((d) => d.trim());

		if (parameters) {
			this.parameters = parameters;
		}

		this.code = (parameters?.code as string) ?? ERROR_CODES.INTERNAL_ERROR;
		this.statusCode = super.getStatus();
		this.date = new Date().toISOString();
	}
}

export class ApiInternalServerException extends BaseException {
	constructor(message?: MessageType, parameters?: ParametersType) {
		super(message ?? ApiInternalServerException.name, 500, parameters);
	}
}

export class ApiNotFoundException extends BaseException {
	constructor(message?: MessageType, parameters?: ParametersType) {
		super(message ?? ApiNotFoundException.name, 404, parameters);
	}
}

export class ApiConflictException extends BaseException {
	constructor(message?: MessageType, parameters?: ParametersType) {
		super(message ?? ApiConflictException.name, 409, parameters);
	}
}

export class ApiUnauthorizedException extends BaseException {
	constructor(message?: MessageType, parameters?: ParametersType) {
		super(message ?? ApiUnauthorizedException.name, 401, parameters);
	}
}

export class ApiBadRequestException extends BaseException {
	constructor(message?: MessageType, parameters?: ParametersType) {
		super(message ?? ApiBadRequestException.name, 400, parameters);
	}
}

export class ApiForbiddenException extends BaseException {
	constructor(message?: MessageType, parameters?: ParametersType) {
		super(message ?? ApiForbiddenException.name, 403, parameters);
	}
}

export class ApiTimeoutException extends BaseException {
	constructor(message?: MessageType, parameters?: ParametersType) {
		super(message ?? ApiTimeoutException.name, 408, parameters);
	}
}
