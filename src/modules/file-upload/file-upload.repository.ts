import { MongoRepository } from "@/core/repository";
import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { FileUpload, FileUploadDocument } from "./schemas/file-upload.schema";

@Injectable()
export class FileUploadRepository extends MongoRepository<FileUploadDocument> {
	constructor(@Inject(FileUpload.name) readonly entity: Model<FileUploadDocument>) {
		super(entity);
	}
}
