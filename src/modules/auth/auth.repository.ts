import { MongoRepository } from "@/core/repository";
import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Auth, AuthDocument } from "./auth.schema";

@Injectable()
export class AuthRepository extends MongoRepository<AuthDocument> {
	constructor(@Inject(Auth.name) readonly entity: Model<AuthDocument>) {
		super(entity);
	}
}
