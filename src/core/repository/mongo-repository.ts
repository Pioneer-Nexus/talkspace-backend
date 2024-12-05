import {
	ClientSession,
	Connection,
	Document,
	FilterQuery,
	Model,
	QueryOptions,
	SaveOptions,
	UpdateQuery,
	UpdateWithAggregationPipeline,
} from "mongoose";

import { ApiBadRequestException } from "@/utils/exception";

import { IRepository } from "./adapter";
import { CreatedOrUpdateModel, RemovedModel, UpdatedModel } from "./types";

export class MongoRepository<T extends Document> implements IRepository<T> {
	constructor(
		protected readonly model: Model<T>,
		protected connection?: Connection,
	) {}

	async insertMany<TOptions = unknown>(documents: Partial<T>[], saveOptions?: TOptions): Promise<T[]> {
		return await this.model.create(documents, saveOptions);
	}

	async create(document: Partial<T>, saveOptions?: SaveOptions): Promise<T> {
		const createdEntity = new this.model({ ...document, _id: document.id });
		const savedResult = await createdEntity.save(saveOptions);

		return savedResult;
	}

	async createOrUpdate(
		document: UpdateWithAggregationPipeline | UpdateQuery<T>,
		options?: unknown,
	): Promise<CreatedOrUpdateModel> {
		if (!document["id"]) {
			throw new ApiBadRequestException("id is required");
		}

		const exists = await this.findById(document["id"]);

		if (!exists) {
			const createdEntity = new this.model({
				...document,
				_id: document["id"],
			});
			const savedResult = await createdEntity.save(options);

			return { id: savedResult.id, created: true, updated: false };
		}

		await this.model.updateOne({ _id: exists.id }, { $set: document }, options);

		return { id: exists.id, created: false, updated: true };
	}

	async findById(id: string | number): Promise<T> {
		const model = await this.model.findById(id);

		if (!model) return null;

		return model.toObject({ virtuals: true });
	}

	async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null> {
		const data = await this.model.findOne(filter, undefined, options);

		if (!data) return null;

		return data.toObject({ virtuals: true });
	}

	async findAll(filter?: FilterQuery<T>): Promise<T[]> {
		const modelList = await this.model.find(filter);

		return (modelList || []).map((u) => u.toObject({ virtuals: true }));
	}

	async remove(filter: FilterQuery<T>): Promise<RemovedModel> {
		const { deletedCount } = await this.model.deleteOne(filter);
		return { deletedCount, deleted: !!deletedCount };
	}

	async updateOne(
		filter: FilterQuery<T>,
		updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
		options?: unknown,
	): Promise<UpdatedModel> {
		return await this.model.updateOne(filter, { $set: Object.assign({}, updated) }, options);
	}

	async findOneAndUpdate(
		filter: FilterQuery<T>,
		updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
		options: QueryOptions = {},
	): Promise<T> {
		Object.assign(options, { new: true });

		const model = await this.model.findOneAndUpdate(filter, { $set: updated }, options);

		if (!model) {
			return null;
		}

		return model.toObject({ virtuals: true });
	}

	async updateMany(
		filter: FilterQuery<T>,
		updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
		options?: unknown,
	): Promise<UpdatedModel> {
		return await this.model.updateMany(filter, { $set: updated }, options);
	}

	async transaction<T>(cb: (session: ClientSession) => Promise<T>): Promise<T> {
		const session = await this.connection.startSession();

		try {
			session.startTransaction();
			const result = await cb(session);
			await session.commitTransaction();
			return result;
		} catch (err) {
			await session.abortTransaction();
			throw err;
		} finally {
			await session.endSession();
		}
	}
}
