import { BaseDocument } from "@/core/entity/base-document";
import { BaseEntity } from "@/core/entity/base-entity";
import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { SignInHistory, SignInHistorySchema } from "./sign-in-history.schema";

export type UserDocument = HydratedDocument<User> & BaseDocument;

@Schema({ timestamps: true })
@ObjectType()
export class User extends BaseEntity {
	@Prop()
	@Field()
	name: string;

	@Prop()
	@Field()
	email: string;

	@Prop({ type: [SignInHistorySchema], default: [] })
	signInHistory: SignInHistory[];
}

@ObjectType()
export class UserDto extends PickType(User, ["_id", "name", "email", "createdAt", "updatedAt"], ObjectType) {}

export const UserSchema = SchemaFactory.createForClass(User);
