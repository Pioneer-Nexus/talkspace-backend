import { Request } from "express";

export type GraphQlResolverContext = {
	req: Request;
};
