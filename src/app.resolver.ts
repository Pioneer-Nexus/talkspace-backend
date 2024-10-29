import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { Auth, CurrentUser, JwtAuthGuard } from "./modules/auth";
import { AuthDto } from "./modules/auth/dtos/auth.dto";

@Resolver()
export class AppResolver {
	constructor() {}

	@Query(() => AuthDto, {})
	@UseGuards(JwtAuthGuard)
	async hello(@CurrentUser() auth: Auth) {
		return auth;
	}
}
