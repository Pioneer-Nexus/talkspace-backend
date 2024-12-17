import { fileUploadJob } from "@/core/constants/jobs";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import * as sharp from "sharp";
import { FileUploadDto } from "../dto/file-upload.dto";
import { FileUploadRepository } from "../file-upload.repository";

@Processor(fileUploadJob.name)
export class FileUploadConsumer {
	constructor(private readonly fileUploadRepository: FileUploadRepository) {}

	@Process(fileUploadJob.events.NEW_IMAGE)
	async optimizeImage(job: Job<FileUploadDto>) {
		const fileData = job.data;

		const uploadPath = join(__dirname, "../../../..", fileData.path);

		const outputDir = join(__dirname, "../../../../tmp/upload/optimized-images/small");
		const outputPath = join(__dirname, "../../../../tmp/upload/optimized-images/small", `${fileData.filename}`);

		if (!existsSync(outputDir)) {
			mkdirSync(outputDir, { recursive: true });
		}

		await sharp(uploadPath)
			.resize(50, null, {
				fit: "inside",
			})
			.webp({ quality: 80 })
			.toFile(outputPath);
	}
}
