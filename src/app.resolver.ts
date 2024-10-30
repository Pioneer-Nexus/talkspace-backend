import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { CurrentUser, JwtAuthGuard } from "./modules/auth";
import { CurrentAuthDto } from "./modules/auth/dtos/current-auth.dto";

@Resolver()
export class AppResolver {
	constructor() {}

	@Query(() => CurrentAuthDto, {
		description: "Just used to desmontrate the use of @CurrentUser",
	})
	@UseGuards(JwtAuthGuard)
	async hello(@CurrentUser() auth: CurrentAuthDto) {
		return auth;
	}
}
