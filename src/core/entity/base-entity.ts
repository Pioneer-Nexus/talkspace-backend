import { Field, ObjectType } from "@nestjs/graphql";
import { Types } from "mongoose";

@ObjectType()
export class BaseEntity {
	@Field(() => String)
	_id: Types.ObjectId;

	@Field()
	createdAt: string;

	@Field()
	updatedAt: string;
}
