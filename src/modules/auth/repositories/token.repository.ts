import { MongoRepository } from "@/core/repository";
import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Token, TokenDocument } from "../schemas/token.schema";

@Injectable()
export class TokenRepository extends MongoRepository<TokenDocument> {
	constructor(@Inject(Token.name) readonly entity: Model<TokenDocument>) {
		super(entity);
	}
}
