import { BaseDocument } from "@/core/entity/base-document";
import { BaseEntity } from "@/core/entity/base-entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type SignInHistoryDocument = HydratedDocument<SignInHistory> & BaseDocument;

@Schema({ timestamps: true, collection: "sign-in-histories" })
@ObjectType()
export class SignInHistory extends BaseEntity {
	@Prop({ required: true })
	@Field()
	ip: string;

	@Prop()
	@Field()
	userAgent: string;

	@Prop({ type: Types.ObjectId, ref: "User", required: true })
	@Field()
	user: Types.ObjectId;
}
export const SignInHistorySchema = SchemaFactory.createForClass(SignInHistory);
