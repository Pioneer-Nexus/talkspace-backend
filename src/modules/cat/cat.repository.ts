import { MongoRepository } from "@/core/repository";
import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Cat, CatDocument } from "./cat.schema";

@Injectable()
export class CatRepository extends MongoRepository<CatDocument> {
	constructor(@Inject(Cat.name) readonly entity: Model<CatDocument>) {
		super(entity);
	}
}
