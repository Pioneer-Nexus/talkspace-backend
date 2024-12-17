import { BaseDocument } from "@/core/entity/base-document";
import { BaseEntity } from "@/core/entity/base-entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type FileUploadDocument = HydratedDocument<FileUpload> & BaseDocument;

@Schema({ timestamps: true, collection: "files" })
@ObjectType()
export class FileUpload extends BaseEntity {
	@Prop()
	@Field()
	originalname: string;

	@Prop()
	@Field()
	encoding: string;

	@Prop()
	@Field()
	mimetype: string;

	@Prop()
	@Field()
	destination: string;

	@Prop()
	@Field()
	pathSmall: string;

	@Prop()
	@Field()
	pathMedium: string;

	@Prop()
	@Field()
	pathLarge: string;

	@Prop()
	@Field()
	filename: string;

	@Prop()
	@Field()
	path: string;

	@Prop({ type: "Number" })
	@Field(() => Int)
	size: number;
}

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);
