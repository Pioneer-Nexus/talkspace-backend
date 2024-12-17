import { Injectable } from "@nestjs/common";
import { CreateFileUploadDto } from "./dto/create-file-upload.dto";
import { FileUploadRepository } from "./file-upload.repository";
import { Types } from "mongoose";
import { FileUpload } from "./file-upload.schema";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { fileUploadJob } from "@/core/constants/jobs";

@Injectable()
export class FileUploadService {
	constructor(
		private readonly fileUploadRepository: FileUploadRepository,
		@InjectQueue(fileUploadJob.name) private fileUploadQueue: Queue,
	) {}

	async create(createFileUploadDto: CreateFileUploadDto): Promise<FileUpload> {
		const fileData = await this.fileUploadRepository.create(createFileUploadDto);

		if (fileData.mimetype.split("/").at(0) === "image") {
			this.fileUploadQueue.add(fileUploadJob.events.NEW_IMAGE, fileData);
		}

		return fileData;
	}

	findOne(id: string): Promise<FileUpload> {
		return this.fileUploadRepository.findOne({ _id: new Types.ObjectId(id) });
	}
}
