import { ApiConflictException } from "@/utils/exception";
import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { SignInHistoryDto } from "../auth/dtos/sign-in-history.dto";
import { UserDocument } from "./schemas/user.schema";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async create(user: Partial<UserDocument>) {
		const existingUser = await this.userRepository.findOne({
			email: user.email,
		});

		if (existingUser) {
			throw new ApiConflictException("User existed");
		}

		return await this.userRepository.create(user);
	}

	async findById(id: string): Promise<UserDocument> {
		const user = await this.userRepository.findById(id);
		return user;
	}

	async addSignInHistory(userId: string, history: SignInHistoryDto) {
		await this.userRepository.findOneAndUpdate(
			{ _id: new Types.ObjectId(userId) },
			{
				$push: {
					signInHistory: history,
				},
			},
		);
	}
}
