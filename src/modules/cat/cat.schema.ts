import { Field, InputType, ObjectType, OmitType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CatDocument = HydratedDocument<Cat>;

@Schema()
@ObjectType()
export class Cat {
	@Prop()
	@Field()
	name: string;

	@Prop()
	@Field()
	age: number;

	@Prop()
	@Field()
	breed: string;
}

@InputType()
export class CatDto extends OmitType(Cat, [], InputType) {}

export const CatSchema = SchemaFactory.createForClass(Cat);
