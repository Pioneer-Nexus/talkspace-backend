import { Field, InputType, ObjectType, OmitType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
@ObjectType()
export class User {
	@Prop()
	@Field()
	name: string;
}

@InputType()
export class UserDto extends OmitType(User, [], InputType) {}

export const UserSchema = SchemaFactory.createForClass(User);
