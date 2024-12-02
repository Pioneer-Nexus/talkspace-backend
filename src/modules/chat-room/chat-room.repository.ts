import { MongoRepository } from "@/core/repository";
import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Room, RoomDocument } from "./schemas/room.schema";

@Injectable()
export class ChatRoomRepository extends MongoRepository<RoomDocument> {
	constructor(@Inject(Room.name) readonly entity: Model<RoomDocument>) {
		super(entity);
	}
}
