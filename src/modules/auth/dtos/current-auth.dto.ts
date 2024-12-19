import { ObjectType, OmitType, PickType } from "@nestjs/graphql";
import { Auth } from "../schemas/auth.schema";
import { User } from "@/modules/user/schemas/user.schema";

@ObjectType()
export class CurrentAuthDto extends OmitType(Auth, ["password"], ObjectType) {}

@ObjectType()
export class CurrentUserDto extends PickType(
	User,
	["_id", "createdAt", "updatedAt", "deletedAt", "email", "name"],
	ObjectType,
) {
	id: string;

	constructor(user: Partial<User>) {
		super();
		Object.assign(this, user);
		this.id = user._id.toString();
	}
}
