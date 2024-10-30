import { ObjectType, OmitType } from "@nestjs/graphql";
import { Auth } from "../schemas/auth.schema";

@ObjectType()
export class CurrentAuthDto extends OmitType(Auth, ["password"], ObjectType) {}
