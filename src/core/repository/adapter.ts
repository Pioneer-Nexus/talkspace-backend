import { CreatedOrUpdateModel, RemovedModel, UpdatedModel } from "./types";

export abstract class IRepository<T> {
	abstract create<TOptions = unknown>(
		document: T,
		saveOptions?: TOptions,
	): Promise<T>;

	abstract createOrUpdate<TUpdate = Partial<T>, TOptions = unknown>(
		updated: TUpdate,
		options?: TOptions,
	): Promise<CreatedOrUpdateModel>;

	abstract insertMany<TOptions = unknown>(
		document: T[],
		saveOptions?: TOptions,
	): Promise<void>;

	abstract findAll<TQuery = Partial<T>, TOptions = unknown>(
		filter: TQuery,
		options?: TOptions | null,
	): Promise<T[]>;

	abstract findOne<TQuery = Partial<T>, TOptions = unknown>(
		filter: TQuery,
		options?: TOptions,
	): Promise<T>;

	abstract remove<TQuery = Partial<T>, TOpt = unknown>(
		filter: TQuery,
		opt?: TOpt,
	): Promise<RemovedModel>;

	abstract updateOne<
		TQuery = Partial<T>,
		TUpdate = Partial<T>,
		TOptions = unknown,
	>(
		filter: TQuery,
		updated: TUpdate,
		options?: TOptions,
	): Promise<UpdatedModel>;

	abstract findOneAndUpdate<
		TQuery = Partial<T>,
		TUpdate = Partial<T>,
		TOptions = unknown,
	>(filter: TQuery, updated: TUpdate, options?: TOptions): Promise<T>;

	abstract updateMany<
		TQuery = Partial<T>,
		TUpdate = Partial<T>,
		TOptions = unknown,
	>(
		filter: TQuery,
		updated: TUpdate,
		options?: TOptions,
	): Promise<UpdatedModel>;
}
