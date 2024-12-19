import { Controller, Get, Param, Post, Query, Req, StreamableFile } from "@nestjs/common";
import { createReadStream, createWriteStream } from "fs";
import { join } from "path";
import { FileUploadService } from "./file-upload.service";
import { isImage } from "./utils/file-checking";
import { getImageConfig, getImageFieldByResolution } from "./utils/image";
import { Types } from "mongoose";
import { pipeline } from "stream";
import * as util from "util";

const pump = util.promisify(pipeline);

@Controller("files")
export class FileUploadController {
	constructor(private readonly fileUploadService: FileUploadService) {}

	@Post("upload")
	// @UseInterceptors(
	// 	FileInterceptor("file", {
	// 		limits: {
	// 			fileSize: 50 * 1024 * 1024,
	// 		},
	// 	}),
	// )
	async uploadFile(@Req() req: any) {
		const data = await req.file();
		const filename = new Types.ObjectId().toHexString();
		const destination = `tmp/upload/origin`;
		const path = `${destination}/${filename}`;
		await pump(data.file, createWriteStream(path));
		const fileDto = {
			...data,
			originalname: data.filename,
			destination,
			path,
			filename,
		};
		const fileData = await this.fileUploadService.create(fileDto);
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
