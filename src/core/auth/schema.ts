import { Field, InputType, ObjectType, OmitType, registerEnumType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type AuthDocument = HydratedDocument<Auth>;

export enum AuthType {
	PASSWORD = 'password',
	GOOGLE = 'google',
}

registerEnumType(AuthType, {
	name: 'AuthType',
});

@Schema()
@ObjectType()
export class Auth {
	@Prop({ type: String, enum: AuthType })
	@Field(() => AuthType)
	type: AuthType;

	@Prop({ nullable: true })
	@Field({ nullable: true })
	authId?: string;

	@Prop({ nullable: true })
	@Field({ nullable: true })
	authSecret?: string;

	@Prop({ nullable: true })
	@Field({ nullable: true })
	username?: string;

	@Prop({ nullable: true })
	@Field({ nullable: true })
	password?: string;

	@Prop()
	@Field(() => Date, { nullable: true })
	expiredAt?: Date;

	@Prop({ type: Types.ObjectId, ref: "User" })
	@Field()
	user: string;
}

@InputType()
export class AuthDto extends OmitType(Auth, [], InputType) {}

export const AuthSchema = SchemaFactory.createForClass(Auth);
