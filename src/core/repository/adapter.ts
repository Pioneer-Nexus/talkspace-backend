import { ClientSession } from "mongoose";
import { CreatedOrUpdateModel, PaginatedDto, PaginationOption, UpdatedModel } from "./types";

export abstract class IRepository<T> {
	abstract create<TOptions = unknown>(document: T, saveOptions?: TOptions): Promise<T>;

	abstract createOrUpdate<TUpdate = Partial<T>, TOptions = unknown>(
		updated: TUpdate,
		options?: TOptions,
	): Promise<CreatedOrUpdateModel>;

	abstract insertMany<TOptions = unknown>(document: T[], saveOptions?: TOptions): Promise<T[]>;

	abstract findAll<TQuery = Partial<T>, TOptions = unknown>(
		filter: TQuery,
		paginationOption: PaginationOption,
		options?: TOptions | null,
	): Promise<PaginatedDto<T>>;

	abstract findOne<TQuery = Partial<T>, TOptions = unknown>(filter: TQuery, options?: TOptions): Promise<T | null>;

	abstract remove<TQuery = Partial<T>, TOpt = unknown>(filter: TQuery, opt?: TOpt): Promise<number>;

	abstract updateOne<TQuery = Partial<T>, TUpdate = Partial<T>, TOptions = unknown>(
		filter: TQuery,
		updated: TUpdate,
		options?: TOptions,
	): Promise<UpdatedModel>;

	abstract findOneAndUpdate<TQuery = Partial<T>, TUpdate = Partial<T>, TOptions = unknown>(
		filter: TQuery,
		updated: TUpdate,
		options?: TOptions,
	): Promise<T>;

	abstract updateMany<TQuery = Partial<T>, TUpdate = Partial<T>, TOptions = unknown>(
		filter: TQuery,
		updated: TUpdate,
		options?: TOptions,
	): Promise<UpdatedModel>;

	abstract transaction<T>(cb: (session: ClientSession) => Promise<T>): Promise<T>;
}
