import { ObjectType, OmitType } from "@nestjs/graphql";
import { Auth } from "../schemas/auth.schema";
import { User } from "@/modules/user/user.schema";

@ObjectType()
export class CurrentAuthDto extends OmitType(Auth, ["password"], ObjectType) {}

@ObjectType()
export class CurrentUserDto extends OmitType(User, [], ObjectType) {}
