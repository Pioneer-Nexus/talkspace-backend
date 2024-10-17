import { ICacheService } from "@/infrastructures/cache";
import { ILoggerService } from "@/infrastructures/logger";
import { Injectable } from "@nestjs/common";
import { CatRepository } from "./cat.repository";
import { Cat, CatDocument } from "./cat.schema";

@Injectable()
export class CatsService {
	constructor(
		private readonly repository: CatRepository,
		private readonly logger: ILoggerService,
		private readonly cache: ICacheService,
	) {
		this.logger.setContext(CatsService.name);
	}

	async create(createCatDto): Promise<CatDocument> {
		const createdCat = await this.repository.create(createCatDto);
		this.cache.set("cat", JSON.stringify(createdCat));
		this.logger.info("New cat created");
		return createdCat;
	}

	async findAll(): Promise<Cat[]> {
		return this.repository.findAll();
	}
}
