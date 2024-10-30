import { Injectable } from "@nestjs/common";
import { AuthRepository } from "./auth.repository";
import { AuthDocument, AuthType } from "./auth.schema";
import { CreatedAuthDto } from "./dtos/created-auth.dto";
import { RegisterAuthLocalInput } from "./dtos/register-auth-local-input.dto";
import * as bcrypt from "bcrypt";
import { UsersService } from "../user/user.service";
import {
	ApiConflictException,
	ApiUnauthorizedException,
} from "@/utils/exception";
import { ILoggerService } from "@/infrastructures/logger";
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./dtos/auth.dto";

@Injectable()
export class AuthService {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly userService: UsersService,
		private readonly logger: ILoggerService,
		private readonly jwtService: JwtService,
	) {}

	async validateLocalUser(
		username: string,
		password: string,
	): Promise<AuthDocument | null> {
		const user = await this.authRepository.findOne(
			{ username },
			{ populate: "user" },
		);

		if (!user)
			throw new ApiUnauthorizedException("Username or password is wrong");

		const isMatch = await bcrypt.compare(password, user.password);
		if (user && isMatch) {
			user.password = "";
			return user;
		}

		return null;
	}

	async loginLocal(username: string, password: string): Promise<AuthDto> {
		const auth = await this.validateLocalUser(username, password);

		if (!auth)
			throw new ApiUnauthorizedException("Username or password is wrong");

		return {
			accessToken: this.jwtService.sign(auth, { expiresIn: "100d" }),
			...auth,
		};
	}

	async registerLocal(
		input: RegisterAuthLocalInput,
	): Promise<CreatedAuthDto> {
		const { name, email, password } = input;

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const existingAuth = await this.authRepository.findOne({
			username: email,
		});

		if (existingAuth) {
			throw new ApiConflictException(
				`Account with email: ${email} already existed`,
			);
		}

		const user = await this.userService.create({ name, email });

		const auth = await this.authRepository.create({
			type: AuthType.PASSWORD,
			username: email,
			password: hash,
			user: user,
		});

		return auth;
	}
}