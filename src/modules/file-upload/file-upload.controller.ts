import { Controller, Get, Param, Post, StreamableFile, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { createReadStream } from "fs";
import { join } from "path";
import { FileUploadService } from "./file-upload.service";

@Controller("files")
export class FileUploadController {
	constructor(private readonly fileUploadService: FileUploadService) {}

	@Post("upload")
	@UseInterceptors(
		FileInterceptor("file", {
			limits: {
				fileSize: 50 * 1024 * 1024,
			},
		}),
	)
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		const fileData = await this.fileUploadService.create(file);
		return fileData;
	}

	@Get(":id")
	async getFile(@Param("id") id: string) {
		const fileData = await this.fileUploadService.findOne(id);
		const filePath = join(process.cwd(), fileData.destination, fileData.filename);
		const file = createReadStream(filePath);
		return new StreamableFile(file);
	}
}
