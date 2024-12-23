import { BaseDocument } from "@/core/entity/base-document";
import { BaseEntity } from "@/core/entity/base-entity";
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "../../user/schemas/user.schema";

export type AuthDocument = HydratedDocument<Auth> & BaseDocument;

export enum AuthType {
	PASSWORD = "password",
	GOOGLE = "google",
}

registerEnumType(AuthType, {
	name: "AuthType",
});

@Schema({ timestamps: true })
@ObjectType()
export class Auth extends BaseEntity {
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
	user: User;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
