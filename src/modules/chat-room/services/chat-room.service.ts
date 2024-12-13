import { PaginatedDto, PaginationOption } from "@/core/repository";
import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { UserDto } from "../../user/user.schema";
import { ChatRoomDto } from "../dtos/chat-room.dto";
import { CreatedChatRoomDto } from "../dtos/created-chat-room.dto";
import { UpdatedChatRoomDto, UpdatedChatRoomResponseDto } from "../dtos/updated-chat-room.dto";
import { UserRoomDto } from "../dtos/user-room.dto";
import { DontAllowToUpdateChatRoom } from "../exceptions/chat-room.exception";
import { ChatRoomRepository } from "../repositories/chat-room.repository";
import { UserRoomRepository } from "../repositories/user-room.repository";
import { RoomRole } from "../schemas/user-room.schema";
import { PaginatedUserRoomDto } from "../dtos/paginated-user-room.dto";

@Injectable()
export class ChatRoomService {
	constructor(
		private readonly chatRoomRepository: ChatRoomRepository,
		private readonly userRoomRepository: UserRoomRepository,
	) {}

	async findUserChatRoom(user: UserDto, paginationOption: PaginationOption): Promise<PaginatedDto<ChatRoomDto>> {
		return await this.chatRoomRepository.findAllChatRoom(
			{
				"userRooms.user": new Types.ObjectId(user._id),
			},
			paginationOption,
		);
	}

	async findAllPendingInvites(roomId: string, paginationOption: PaginationOption): Promise<PaginatedUserRoomDto> {
		return await this.userRoomRepository.findAll(
			{ room: new Types.ObjectId(roomId), role: RoomRole.PENDING_INVITE },
			paginationOption,
		);
	}

	async create(user: UserDto, room: CreatedChatRoomDto) {
		return await this.chatRoomRepository.createChatRoom(user, room);
	}

	async addNewUser(userId: string, roomId: string): Promise<ChatRoomDto> {
		return await this.chatRoomRepository.addNewUser(userId, roomId);
	}

	async removeUser(userId: string, roomId: string): Promise<ChatRoomDto> {
		return await this.chatRoomRepository.removeUser(userId, roomId);
	}

	async acceptToJoin(userId: string, roomId: string): Promise<UserRoomDto> {
		return await this.chatRoomRepository.acceptToJoin(userId, roomId);
	}

	async update(user: UserDto, room: UpdatedChatRoomDto): Promise<UpdatedChatRoomResponseDto> {
		const userRoom = await this.userRoomRepository.findOne({
			room: new Types.ObjectId(room._id),
			user: new Types.ObjectId(user._id),
			role: RoomRole.ADMIN,
		});

		if (!userRoom) throw new DontAllowToUpdateChatRoom();

		return await this.chatRoomRepository.updateChatRoom(room);
	}

	async findById(id: string) {
		return await this.chatRoomRepository.findById(id);
	}

	async remove(id: string): Promise<string> {
		await this.chatRoomRepository.remove({ _id: id });
		return id;
	}
}
