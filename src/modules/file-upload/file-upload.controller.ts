import { Controller, Get, Param, Post, Query, StreamableFile, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { createReadStream } from "fs";
import { join } from "path";
import { FileUploadService } from "./file-upload.service";
import { isImage } from "./utils/file-checking";
import { getImageConfig, getImageFieldByResolution } from "./utils/image";

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
	async getFile(@Param("id") id: string, @Query("width") width: number = 480, @Query("height") height: number = 480) {
		const fileData = await this.fileUploadService.findOne(id);

		// Default filePath is the origin file path, then check its resolution and assign filePath by the new
		// optimized file path if it exists
		let filePath = join(process.cwd(), fileData.destination, fileData.filename);

		if (isImage(fileData)) {
			const imageConfig = getImageConfig(width, height);
			const imageField = getImageFieldByResolution(imageConfig.resolution);
			if (fileData.optimizedPaths[imageField]) {
				filePath = fileData.optimizedPaths[imageField];
			}
		}

		const file = createReadStream(filePath);

		return new StreamableFile(file, {
			type: fileData.mimetype,
			disposition: `inline`,
		});
	}
}
