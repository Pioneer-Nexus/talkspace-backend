import { Field, ObjectType, OmitType } from "@nestjs/graphql";
import { Auth } from "../auth.schema";

@ObjectType()
export class AuthDto extends OmitType(Auth, ["password"], ObjectType) {
    @Field()
	accessToken: string;
}
