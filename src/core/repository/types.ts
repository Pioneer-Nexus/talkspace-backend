import { Field, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

export type UpdatedModel = {
	matchedCount: number;
	modifiedCount: number;
	acknowledged: boolean;
	upsertedId: unknown | ObjectId;
	upsertedCount: number;
};

export type RemovedModel = {
	deletedCount: number;
	deleted: boolean;
};

export type CreatedModel = {
	id: string;
	created: boolean;
};

export type CreatedOrUpdateModel = {
	id: string;
	created: boolean;
	updated: boolean;
};

export enum DatabaseOperationEnum {
	EQUAL = "equal",
	NOT_EQUAL = "not_equal",
	NOT_CONTAINS = "not_contains",
	CONTAINS = "contains",
}

export type DatabaseOperationCommand<T> = {
	property: keyof T;
	value: unknown[];
	command: DatabaseOperationEnum;
};

export type PaginationOption = {
	page: number;
	pageSize: number;
};

@ObjectType()
export class PaginatedDto<T> {
	@Field(() => Number)
	page: number;

	@Field(() => Number)
	pageSize: number;

	@Field(() => Number)
	totalRecord: number;

	@Field(() => Number)
	totalPage: number;

	@Field(() => Boolean)
	hasNext: boolean;

	@Field(() => Boolean)
	hasPrev: boolean;

	data: T[];
}

export function GeneratePaginatedDto<T>(dto: new () => T) {
	@ObjectType()
	class GenereratedPaginatedDto extends PaginatedDto<T> {
		@Field(() => [dto])
		data: T[];
	}

	return GenereratedPaginatedDto;
}
