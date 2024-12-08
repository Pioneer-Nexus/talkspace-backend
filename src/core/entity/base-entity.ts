import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@ObjectType()
@Schema({
	timestamps: true,
})
export class BaseEntity {
	@Field(() => String)
	_id: Types.ObjectId;

	@Field()
	createdAt: string;

	@Field()
	updatedAt: string;

	@Field()
	@Prop({ type: () => Date })
	deletedAt: string;
}
