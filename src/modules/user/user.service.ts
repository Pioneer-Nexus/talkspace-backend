import { ApiConflictException } from "@/utils/exception";
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserDocument } from "./user.schema";

@Injectable()
export class UsersService {
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
}
