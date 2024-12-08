import { Injectable } from "@nestjs/common";
import { UserRoomRepository } from "../repositories/user-room.repository";
import { UserRoomDto } from "../dtos/user-room.dto";
import { Types } from "mongoose";

@Injectable()
export class UserRoomService {
	constructor(private readonly userRoomRepository: UserRoomRepository) {}

	async findAll(ids: string[]): Promise<UserRoomDto[]> {
		const result = await this.userRoomRepository.findAll({
			_id: {
				$in: ids,
			},
		});
		return result.data;
	}

	async findByRoomId(id: string): Promise<UserRoomDto[]> {
		const result = await this.userRoomRepository.findAll({ room: new Types.ObjectId(id) });
		return result.data;
	}
}
