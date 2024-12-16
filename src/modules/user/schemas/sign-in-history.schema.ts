import { BaseEntity } from "@/core/entity/base-entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
@ObjectType()
export class SignInHistory extends BaseEntity {
	@Prop({ required: true })
	@Field()
	ip: string;

	@Prop()
	@Field()
	userAgent: string;
}
export const SignInHistorySchema = SchemaFactory.createForClass(SignInHistory);
