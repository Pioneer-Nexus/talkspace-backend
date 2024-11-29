import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ timestamps: true })
@ObjectType()
export class Webhook {
	@Prop()
	@Field({ nullable: false })
	name: string;

	@Prop()
	@Field({ nullable: false })
	id: string;
}
