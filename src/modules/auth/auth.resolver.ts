import { GraphQlResolverContext } from "@/infrastructures/graphql";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dtos/auth.dto";
import { CreatedAuthDto } from "./dtos/created-auth.dto";
import { RegisterAuthLocalInput } from "./dtos/register-auth-local-input.dto";

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => CreatedAuthDto, {
		description: "Register new user with username and password",
	})
	async registerUserWithCredential(@Args("input") input: RegisterAuthLocalInput) {
		return await this.authService.registerLocal(input);
	}

	@Mutation(() => AuthDto, {
		description: "Login with username and password",
	})
	async loginWithCredential(
		@Args("username") username: string,
		@Args("password") password: string,
		@Context() context: GraphQlResolverContext,
	) {
		const authInfo = await this.authService.loginLocal(username, password);
		await this.authService.saveSignInHistory(
			authInfo.user._id.toString(),
			context.req.ip,
			context.req.headers["user-agent"],
		);

		return authInfo;
	}

	@Mutation(() => AuthDto, {
		description: "Refresh token and rotate it",
	})
	async refreshToken(@Args("token") token: string) {
		const authInfo = await this.authService.refreshToken(token);

		return authInfo;
	}
}
