import { fileUploadJob } from "@/core/constants/jobs";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import * as sharp from "sharp";
import { FileUploadDto } from "../dto/file-upload.dto";
import { FileUploadRepository } from "../file-upload.repository";
import { Types } from "mongoose";

@Processor(fileUploadJob.name)
export class FileUploadConsumer {
	constructor(private readonly fileUploadRepository: FileUploadRepository) {}

	@Process(fileUploadJob.events.NEW_IMAGE)
	async optimizeImage(job: Job<FileUploadDto>) {
		const fileData = job.data;

		const uploadPath = join(__dirname, "../../../..", fileData.path);

		await this.optimizeImageWithSize({
			width: 100,
			height: 100,
			path: uploadPath,
			name: "small",
			field: "pathSmall",
			fileData,
		});

		await this.optimizeImageWithSize({
			width: 800,
			height: 800,
			path: uploadPath,
			name: "medium",
			field: "pathMedium",
			fileData,
		});

		await this.optimizeImageWithSize({
			path: uploadPath,
			name: "large",
			field: "pathLarge",
			fileData,
		});
	}

	async optimizeImageWithSize({
		width,
		height,
		path: uploadPath,
		name,
		field,
		fileData,
	}: {
		width?: number;
		height?: number;
		path: string;
		name: "small" | "medium" | "large";
		field: "pathSmall" | "pathMedium" | "pathLarge";
		fileData: FileUploadDto;
	}) {
		const folderPath = `tmp/upload/optimized-images/${name}`;
		const outputDir = join(__dirname, `../../../../${folderPath}`);
		const pathField = join(__dirname, `../../../../${folderPath}`, fileData.filename);
		const outputPath = join(__dirname, `../../../../${folderPath}`, `${fileData.filename}`);

		if (!existsSync(outputDir)) {
			mkdirSync(outputDir, { recursive: true });
		}

		if (!width || !height) {
			await sharp(uploadPath).webp({ quality: 100 }).toFile(outputPath);
		} else {
			await sharp(uploadPath).resize(width, height, { fit: "inside" }).webp({ quality: 100 }).toFile(outputPath);
		}

		await this.fileUploadRepository.findOneAndUpdate(
			{ _id: new Types.ObjectId(fileData._id) },
			{ [field]: pathField, mimetype: "image/webp" },
		);
	}
}
