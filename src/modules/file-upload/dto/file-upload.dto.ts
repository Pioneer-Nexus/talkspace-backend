import { ObjectType, PickType } from "@nestjs/graphql";
import { FileUpload } from "../file-upload.schema";

export class FileUploadDto extends PickType(
	FileUpload,
	[
		"_id",
		"createdAt",
		"updatedAt",
		"deletedAt",
		"destination",
		"encoding",
		"filename",
		"mimetype",
		"originalname",
		"path",
		"size",
	],
	ObjectType,
) {}
