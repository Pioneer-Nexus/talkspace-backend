import { Inject, Injectable } from "@nestjs/common";
import { CatRepository } from "./cat.repository";
import { Cat, CatDocument } from "./cat.schema";
import { LoggerService } from "@/infrastructures/logger";

@Injectable()
export class CatsService {
	constructor(
		private readonly repository: CatRepository,
		@Inject() private logger: LoggerService,
	) {
		this.logger.setContext(CatsService.name);
	}

	async create(createCatDto): Promise<CatDocument> {
		const createdCat = await this.repository.create(createCatDto);
		this.logger.info("New cat created");
		return createdCat;
	}

	async findAll(): Promise<Cat[]> {
		return this.repository.findAll();
	}
}
