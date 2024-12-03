import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserRoomInputDTO {
	@Field(() => String, { nullable: false })
	user: string;
}
