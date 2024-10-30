import { BaseDocument } from "@/core/entity/base-document";
import { BaseEntity } from "@/core/entity/base-entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TokenDocument = HydratedDocument<Token> & BaseDocument;

@Schema({ timestamps: true })
@ObjectType()
export class Token extends BaseEntity {
	@Prop({ nullable: false })
	@Field({ nullable: false })
	refreshToken: string;

	@Prop({ nullable: false, type: () => Boolean, default: false })
	@Field(() => Boolean)
	isRevoked: boolean;

	@Prop()
	@Field(() => Date, { nullable: true })
	expiredAt?: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
