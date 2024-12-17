import { SignInHistory } from "@/modules/auth/schemas/sign-in-history.schema";
import { ObjectType, OmitType } from "@nestjs/graphql";
import { Types } from "mongoose";

@ObjectType()
export class SignInHistoryDto extends OmitType(SignInHistory, [], ObjectType) {
	user: Types.ObjectId;

	constructor(
		userId: string,
		public ip: string,
		public userAgent: string,
	) {
		super(ip, userAgent);
		this.user = new Types.ObjectId(userId);
	}
}
