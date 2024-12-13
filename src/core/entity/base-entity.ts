import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { GraphQLDateTimeISO } from "graphql-scalars";
import { Types } from "mongoose";

@ObjectType()
@Schema({
	timestamps: true,
})
export class BaseEntity {
	@Field(() => String)
	_id: Types.ObjectId;

	@Field(() => GraphQLDateTimeISO)
	createdAt: Date;

	@Field(() => GraphQLDateTimeISO)
	updatedAt: Date;

	@Field(() => GraphQLDateTimeISO, { nullable: true })
	@Prop({ type: () => Date })
	deletedAt?: Date;
}
