import { IConfigAdapter } from "@/infrastructures/config";
import { ILoggerService } from "@/infrastructures/logger";
import {
	ApiConflictException,
	ApiUnauthorizedException,
} from "@/utils/exception";
import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../user/user.service";
import { AuthDto } from "./dtos/auth.dto";
import { CreatedAuthDto } from "./dtos/created-auth.dto";
import { RegisterAuthLocalInput } from "./dtos/register-auth-local-input.dto";
import { AuthRepository } from "./repositories/auth.repository";
import { TokenRepository } from "./repositories/token.repository";
import { AuthDocument, AuthType } from "./schemas/auth.schema";
import * as _ from "lodash";

@Injectable()
export class AuthService {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly tokenRepository: TokenRepository,
		private readonly userService: UsersService,
		private readonly logger: ILoggerService,
		private readonly jwtService: JwtService,
		private readonly config: IConfigAdapter,
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
			delete user.password;
			return user;
		}

		return null;
	}

	generateToken(_authData: AuthDocument): {
		accessToken: string;
		refreshToken: string;
	} {
		const authData = _.pick(_authData, [
			"_id",
			"__v",
			"id",
			"type",
			"username",
			"user",
			"createdAt",
			"updatedAt",
		]);
		const accessToken = this.jwtService.sign(authData, {
			expiresIn: `${this.config.JWT_EXPIRED}s`,
		});
		const refreshToken = this.jwtService.sign(authData, {
			expiresIn: `${this.config.JWT_REFRESH_EXPIRED}s`,
		});

		return { accessToken, refreshToken };
	}

	async refreshToken(refreshToken: string): Promise<AuthDto> {
		const decoded = (await this.jwtService.verify(refreshToken, {
			secret: this.config.JWT_SECRET,
		})) as AuthDocument;
		const token = this.generateToken(decoded);

		const existingToken = await this.tokenRepository.findOne({
			refreshToken,
		});

		if (!existingToken || existingToken.isRevoked) {
			throw new BadRequestException("Refresh token is invalid");
		}

		await this.tokenRepository.updateOne(
			{
				refreshToken,
			},
			{
				refreshToken: token.refreshToken,
				isRevoked: false,
				expiredAt: new Date(
					new Date().getTime() +
						this.config.JWT_REFRESH_EXPIRED * 1000,
				),
			},
		);

		return { ...decoded, ...token };
	}

	async loginLocal(username: string, password: string): Promise<AuthDto> {
		const auth = await this.validateLocalUser(username, password);

		if (!auth)
			throw new ApiUnauthorizedException("Username or password is wrong");

		const token = this.generateToken(auth);

		await this.tokenRepository.create({
			refreshToken: token.refreshToken,
			isRevoked: false,
			expiredAt: new Date(
				new Date().getTime() + this.config.JWT_REFRESH_EXPIRED * 1000,
			),
		});

		return { ...token, ...auth };
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
