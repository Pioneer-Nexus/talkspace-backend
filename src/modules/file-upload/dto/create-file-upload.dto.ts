import { InputType, PickType } from "@nestjs/graphql";
import { FileUpload } from "../file-upload.schema";

export class CreateFileUploadDto extends PickType(
	FileUpload,
	["destination", "encoding", "filename", "mimetype", "originalname", "path", "size"],
	InputType,
) {}
