import { User } from "@/modules/user/user.schema";
import { InputType, IntersectionType, PickType } from "@nestjs/graphql";
import { Auth } from "../schemas/auth.schema";

@InputType()
export class RegisterAuthLocalInput extends PickType(
	IntersectionType(Auth, User),
	["password", "name", "email"],
	InputType,
) {}
