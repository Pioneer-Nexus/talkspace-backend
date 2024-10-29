import { BaseEntity } from "@/core/entity/base-entity";
import { Field, InputType, ObjectType, OmitType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
@ObjectType()
export class User extends BaseEntity {
	@Prop()
	@Field()
	name: string;

	@Prop()
	@Field()
	email: string;
}

@InputType()
export class UserDto extends OmitType(User, [], InputType) {}

export const UserSchema = SchemaFactory.createForClass(User);
