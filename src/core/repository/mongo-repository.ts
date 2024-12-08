import {
	ClientSession,
	Connection,
	FilterQuery,
	Model,
	PipelineStage,
	QueryOptions,
	SaveOptions,
	UpdateQuery,
	UpdateWithAggregationPipeline,
} from "mongoose";

import { ApiBadRequestException } from "@/utils/exception";

import { BaseDocument } from "../entity/base-document";
import { IRepository } from "./adapter";
import { CreatedOrUpdateModel, PaginatedDto, PaginationOption, UpdatedModel } from "./types";
import { DEFAULT_PAGINATION_SIZE, generatePaginationAggregation } from "./service";

export class MongoRepository<T extends BaseDocument> implements IRepository<T> {
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

	async findAll(
		_filter: FilterQuery<T>,
		paginationOption?: PaginationOption,
		options: QueryOptions<T> = {},
	): Promise<PaginatedDto<T>> {
		const filter = {
			deletedAt: { $exists: false },
			..._filter,
		};

		if (paginationOption) {
			const modelList = await this.model.find(filter, undefined, {
				skip: paginationOption.page * paginationOption.pageSize,
				limit: paginationOption.pageSize,
				...options,
			});
			const totalRecord = await this.model.countDocuments(filter);
			const totalPage = Math.ceil(totalRecord / paginationOption.pageSize);
			const data = (modelList || []).map((u) => u.toObject({ virtuals: true }));

			return {
				data,
				page: paginationOption.page,
				pageSize: paginationOption.pageSize,
				totalRecord,
				totalPage,
				hasNext: !!(paginationOption.page > totalPage - 1),
				hasPrev: !!(paginationOption.page > 0),
			};
		}

		const modelList = await this.model.find(filter, undefined, options);
		const data = (modelList || []).map((u) => u.toObject({ virtuals: true }));

		return {
			data,
			page: 0,
			pageSize: data.length,
			totalRecord: data.length,
			totalPage: 1,
			hasNext: false,
			hasPrev: false,
		};
	}

	async remove(filter: FilterQuery<T>): Promise<number> {
		const data = await this.model.updateMany(filter, { deletedAt: new Date() });
		return data.modifiedCount;
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

	async aggregate(
		aggregations: PipelineStage[],
		paginationOption: PaginationOption = DEFAULT_PAGINATION_SIZE,
	): Promise<PaginatedDto<T>> {
		const result = (
			await this.model.aggregate([
				...aggregations,
				{
					$facet: {
						data: generatePaginationAggregation(paginationOption),
						count: [{ $count: "count" }],
					},
				},
			])
		)?.[0] ?? { data: [], count: [{ count: 0 }] };

		const data = result.data;
		const count = result.count[0]?.count ?? 0;

		const totalPage = Math.ceil(count / paginationOption.pageSize);

		return {
			data,
			page: paginationOption.page,
			pageSize: paginationOption.pageSize,
			totalRecord: count,
			totalPage,
			hasNext: !!(paginationOption.page > totalPage - 1),
			hasPrev: !!(paginationOption.page > 0),
		};
	}
}
