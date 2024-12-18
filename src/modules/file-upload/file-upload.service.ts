import { fileUploadJob } from "@/core/constants/jobs";
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { Types } from "mongoose";
import { CreateFileUploadDto } from "./dto/create-file-upload.dto";
import { FileUploadRepository } from "./file-upload.repository";
import { FileUpload } from "./file-upload.schema";
import { isImage } from "./utils/file-checking";

@Injectable()
export class FileUploadService {
	constructor(
		private readonly fileUploadRepository: FileUploadRepository,
		@InjectQueue(fileUploadJob.name) private fileUploadQueue: Queue,
	) {}

	async create(createFileUploadDto: CreateFileUploadDto): Promise<FileUpload> {
		const fileData = await this.fileUploadRepository.create(createFileUploadDto);

		if (isImage(fileData)) {
			this.fileUploadQueue.add(fileUploadJob.events.NEW_IMAGE, fileData);
		}

		return fileData;
	}

	findOne(id: string): Promise<FileUpload> {
		return this.fileUploadRepository.findOne({ _id: new Types.ObjectId(id) });
	}
}
