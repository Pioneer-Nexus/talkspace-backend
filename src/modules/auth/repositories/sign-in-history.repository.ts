import { MongoRepository } from "@/core/repository";
import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { SignInHistory, SignInHistoryDocument } from "../schemas/sign-in-history.schema";

@Injectable()
export class SignInHistoryRepository extends MongoRepository<SignInHistoryDocument> {
	constructor(@Inject(SignInHistory.name) readonly entity: Model<SignInHistoryDocument>) {
		super(entity);
	}
}
