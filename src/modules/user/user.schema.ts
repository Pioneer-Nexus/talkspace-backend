import { BaseEntity } from "@/core/entity/base-entity";
import { Field, ObjectType, PickType } from "@nestjs/graphql";
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

@ObjectType()
export class UserDto extends PickType(User, ["_id", "name", "email", "createdAt", "updatedAt"], ObjectType) {}

export const UserSchema = SchemaFactory.createForClass(User);
