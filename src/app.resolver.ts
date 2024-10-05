import { Query, Resolver } from "@nestjs/graphql";
import { ApiBadRequestException } from "./utils/exception";

@Resolver()
export class AppResolver {
	constructor() {}

	@Query(() => String, {})
	async hello() {
		throw new Error("afdsaf");
	}
}
