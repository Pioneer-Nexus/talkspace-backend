import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { CreatedAuthDto } from "./dtos/created-auth.dto";
import { RegisterAuthLocalInput } from "./dtos/register-auth-local-input.dto";

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => CreatedAuthDto)
	async registerLocalUser(@Args("input") input: RegisterAuthLocalInput) {
		return await this.authService.registerLocal(input);
	}
}
