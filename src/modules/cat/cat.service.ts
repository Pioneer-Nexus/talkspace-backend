import { Injectable } from "@nestjs/common";
import { CatRepository } from "./cat.repository";
import { Cat, CatDocument } from "./cat.schema";

@Injectable()
export class CatsService {
	constructor(private readonly repository: CatRepository) {}

	async create(createCatDto): Promise<CatDocument> {
		const createdCat = await this.repository.create(createCatDto);
		return createdCat;
	}

	async findAll(): Promise<Cat[]> {
		return this.repository.findAll();
	}
}
