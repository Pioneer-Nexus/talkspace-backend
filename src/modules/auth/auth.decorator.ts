import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { CurrentAuthDto } from "./dtos/current-auth.dto";

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
	const ctx = GqlExecutionContext.create(context);
	return ctx.getContext().req.user as CurrentAuthDto;
});
