import { ObjectType, OmitType } from "@nestjs/graphql";
import { Auth } from "../schemas/auth.schema";

@ObjectType()
export class CreatedAuthDto extends OmitType(Auth, ["password"], ObjectType) {}
