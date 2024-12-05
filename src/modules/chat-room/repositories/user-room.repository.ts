import { MongoRepository } from "@/core/repository";
import { MONGO_CONNECTION } from "@/infrastructures/database";
import { Inject, Injectable } from "@nestjs/common";
import { Connection, Model } from "mongoose";
import { UserRoom, UserRoomDocument } from "../schemas/user-room.schema";

@Injectable()
export class UserRoomRepository extends MongoRepository<UserRoomDocument> {
	constructor(
		@Inject(UserRoom.name) private readonly entity: Model<UserRoomDocument>,
		@Inject(MONGO_CONNECTION) connection: Connection,
	) {
		super(entity, connection);
	}
}
