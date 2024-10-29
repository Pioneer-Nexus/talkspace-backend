import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { JwtAuthGuard } from "./modules/auth";

@Resolver()
export class AppResolver {
	constructor() {}

	@Query(() => String, {})
	@UseGuards(JwtAuthGuard)
	async hello() {
		return "";
	}
}
