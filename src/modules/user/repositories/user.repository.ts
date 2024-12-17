import { MongoRepository } from "@/core/repository";
import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/user.schema";

@Injectable()
export class UserRepository extends MongoRepository<UserDocument> {
	constructor(@Inject(User.name) readonly entity: Model<UserDocument>) {
		super(entity);
	}
}
