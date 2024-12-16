import { SignInHistory } from "@/modules/user/schemas/sign-in-history.schema";
import { ObjectType, OmitType } from "@nestjs/graphql";

@ObjectType()
export class SignInHistoryDto extends OmitType(SignInHistory, [], ObjectType) {
	constructor(
		private ip: string,
		private userAgent: string,
	) {
		super(ip, userAgent);
	}
}
