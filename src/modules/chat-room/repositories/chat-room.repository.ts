import EXCEPTION_MESSAGES from "@/core/constants/exception";
import { MongoRepository, PaginationOption } from "@/core/repository";
import { MONGO_CONNECTION } from "@/infrastructures/database";
import { ProcessException } from "@/utils/exception";
import { Inject, Injectable } from "@nestjs/common";
import { Connection, Model, Types } from "mongoose";
import { UserDto } from "../../user/user.schema";
import { ChatRoomDto } from "../dtos/chat-room.dto";
import { CreatedChatRoomDto, CreatedChatRoomResponseDto } from "../dtos/created-chat-room.dto";
import { PaginatedChatRoomDto } from "../dtos/paginated-chat-room.dto";
import { UpdatedChatRoomDto, UpdatedChatRoomResponseDto } from "../dtos/updated-chat-room.dto";
import { Room, RoomDocument } from "../schemas/room.schema";
import { RoomRole, UserRoom } from "../schemas/user-room.schema";
import { UserRoomRepository } from "./user-room.repository";

@Injectable()
export class ChatRoomRepository extends MongoRepository<RoomDocument> {
	constructor(
		@Inject(Room.name) private readonly entity: Model<RoomDocument>,
		@Inject(MONGO_CONNECTION) connection: Connection,
		private readonly userRoomRepository: UserRoomRepository,
	) {
		super(entity, connection);
	}

	async addNewUser(userId: string, roomId: string): Promise<ChatRoomDto> {
		return await this.transaction(async (session) => {
			const userRoom = await this.userRoomRepository.createOrUpdate(
				{
					user: new Types.ObjectId(userId),
					room: new Types.ObjectId(roomId),
				},
				{
					user: new Types.ObjectId(userId),
					room: new Types.ObjectId(roomId),
					isNotify: true,
					role: RoomRole.PENDING_INVITE,
				},
				{ session },
			);
			const result = await this.findOneAndUpdate(
				{ _id: new Types.ObjectId(roomId) },
				{ $addToSet: { userRooms: new Types.ObjectId(userRoom.id) } },
				{ session },
			);
			return result as ChatRoomDto;
		});
	}

	async removeUser(userId: string, roomId: string): Promise<ChatRoomDto> {
		return await this.transaction(async (session) => {
			const userRoom = await this.userRoomRepository.findOneAndRemove(
				{
					user: new Types.ObjectId(userId),
					room: new Types.ObjectId(roomId),
				},
				{ session },
			);
			if (!userRoom) {
				throw new ProcessException(EXCEPTION_MESSAGES.USER_NOT_FOUND_IN_CHAT_ROOM);
			}
			const result = await this.findOneAndUpdate(
				{ _id: new Types.ObjectId(roomId) },
				{ $pullAll: { userRooms: [new Types.ObjectId(userRoom._id)] } },
				{ session },
			);
			return result as ChatRoomDto;
		});
	}

	async findAllChatRoom(filter, paginationOption: PaginationOption): Promise<PaginatedChatRoomDto> {
		const result = await this.aggregate(
			[
				{ $unwind: "$userRooms" },
				{
					$lookup: {
						from: "userrooms",
						localField: "userRooms",
						foreignField: "_id",
						as: "userRooms",
					},
				},
				{ $unwind: "$userRooms" },
				{
					$match: filter,
				},
				{
					$group: {
						_id: "$_id",
						name: { $first: "$name" },
						createdAt: { $first: "$createdAt" },
						deletedAt: { $first: "$deletedAt" },
						updatedAt: { $first: "$updatedAt" },
						status: { $first: "$status" },
						imageUrl: { $first: "$imageUrl" },
						type: { $first: "$type" },
						userRooms: { $push: "$userRooms" },
					},
				},
			],
			paginationOption,
		);
		return result;
	}

	async createChatRoom(
		user: UserDto,
		{ userRooms, ...roomData }: CreatedChatRoomDto,
	): Promise<CreatedChatRoomResponseDto> {
		return this.transaction(async (session) => {
			const room = new this.model({ ...roomData, webhooks: roomData.webhooks });
			const createdRoom = (await room.save({ session })).toObject();

			const userIds = Array.from(new Set([user._id, ...userRooms.map((userRoom) => userRoom.user)]).values());

			const userRoomDatas = await this.userRoomRepository.insertMany(
				userIds.map((userId) => ({
					user: new Types.ObjectId(userId),
					room: room._id,
					role: userId == user._id ? RoomRole.ADMIN : RoomRole.MEMBER,
				})),
				{ session },
			);

			room.userRooms = userRoomDatas.map((d) => d._id);
			await room.save();

			return {
				...createdRoom,
				userRooms: userRoomDatas.map((d) => d.toObject()),
			};
		});
	}

	async updateChatRoom(roomData: UpdatedChatRoomDto): Promise<UpdatedChatRoomResponseDto> {
		const result = await this.findOneAndUpdate({ _id: roomData._id }, roomData);

		return {
			...result,
			userRooms: result.userRooms.map((d) => (d as UserRoom).user as Types.ObjectId),
		};
	}
}
