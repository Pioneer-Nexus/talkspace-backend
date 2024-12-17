import { Controller, Get, Param, Post, Query, StreamableFile, UploadedFile, UseInterceptors } from "@nestjs/common";
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
	async getFile(@Param("id") id: string, @Query("width") width: number, @Query("height") height: number) {
		const fileData = await this.fileUploadService.findOne(id);

		let filePath = join(process.cwd(), fileData.destination, fileData.filename);
		if (fileData.pathSmall && Math.max(width, height) <= 100) {
			filePath = fileData.pathSmall;
		} else if (fileData.pathMedium && Math.max(width, height) <= 800) {
			filePath = fileData.pathMedium;
		} else if (fileData.pathLarge) {
			filePath = fileData.pathLarge;
		}

		const file = createReadStream(filePath);

		return new StreamableFile(file, {
			type: fileData.mimetype,
			disposition: fileData.originalname,
		});
	}
}
