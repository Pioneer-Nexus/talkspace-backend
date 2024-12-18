import { fileUploadJob } from "@/core/constants/jobs";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import * as sharp from "sharp";
import { FileUploadDto } from "../dto/file-upload.dto";
import { FileUploadRepository } from "../file-upload.repository";
import { Types } from "mongoose";
import { imageOptimizationConfig } from "../config/image-optimization.config";

@Processor(fileUploadJob.name)
export class FileUploadConsumer {
	constructor(private readonly fileUploadRepository: FileUploadRepository) {}

	@Process(fileUploadJob.events.NEW_IMAGE)
	async optimizeImage(job: Job<FileUploadDto>) {
		const fileData = job.data;

		const uploadPath = join(__dirname, "../../../..", fileData.path);

		await Promise.all(
			imageOptimizationConfig.map(async ({ resolution, quality }) => {
				await this.optimizeImageWithSize({
					resolution,
					quality,
					path: uploadPath,
					fileData,
				});
			}),
		);
	}

	async optimizeImageWithSize({
		resolution,
		quality,
		path: uploadPath,
		fileData,
	}: {
		resolution: number;
		quality: number;
		path: string;
		fileData: FileUploadDto;
	}) {
		const name = `${resolution}`;
		const folderPath = `tmp/upload/optimized-images/${name}`;
		const outputDir = join(__dirname, `../../../../${folderPath}`);
		const pathField = join(__dirname, `../../../../${folderPath}`, fileData.filename);
		const outputPath = join(__dirname, `../../../../${folderPath}`, `${fileData.filename}`);

		if (!existsSync(outputDir)) {
			mkdirSync(outputDir, { recursive: true });
		}

		await sharp(uploadPath).resize(resolution, resolution, { fit: "inside" }).webp({ quality }).toFile(outputPath);

		await this.fileUploadRepository.findOneAndUpdate(
			{ _id: new Types.ObjectId(fileData._id) },
			{ [`optimizedPaths.${name}`]: pathField, mimetype: "image/webp" },
		);
	}
}
