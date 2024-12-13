import { MongoRepository } from "@/core/repository";
import { MONGO_CONNECTION } from "@/infrastructures/database";
import { Inject, Injectable } from "@nestjs/common";
import { Connection, Model } from "mongoose";
import { Notification, NotificationDocument } from "../schemas/notification.schema";

@Injectable()
export class NotificationRepository extends MongoRepository<NotificationDocument> {
	constructor(
		@Inject(Notification.name) private readonly entity: Model<NotificationDocument>,
		@Inject(MONGO_CONNECTION) connection: Connection,
	) {
		super(entity, connection);
	}
}
