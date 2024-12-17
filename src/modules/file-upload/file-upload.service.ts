import { Injectable } from "@nestjs/common";
import { CreateFileUploadDto } from "./dto/create-file-upload.dto";
import { FileUploadRepository } from "./file-upload.repository";
import { Types } from "mongoose";
import { FileUpload } from "./schemas/file-upload.schema";

@Injectable()
export class FileUploadService {
	constructor(private readonly fileUploadRepository: FileUploadRepository) {}

	create(createFileUploadDto: CreateFileUploadDto): Promise<FileUpload> {
		return this.fileUploadRepository.create(createFileUploadDto);
	}

	findOne(id: string): Promise<FileUpload> {
		return this.fileUploadRepository.findOne({ _id: new Types.ObjectId(id) });
	}
}
