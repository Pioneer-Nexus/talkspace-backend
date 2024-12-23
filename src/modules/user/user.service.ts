import { ApiConflictException } from "@/utils/exception";
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { UserDocument } from "./schemas/user.schema";

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
}
