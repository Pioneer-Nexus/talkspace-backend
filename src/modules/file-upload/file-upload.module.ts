import { fileUploadJob } from "@/core/constants/jobs";
import { AppDatabaseModule } from "@/infrastructures/database";
import { AppQueueModule } from "@/infrastructures/queue";
import { generateMongoProvider } from "@/utils/mongo";
import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { FileUploadConsumer } from "./consumers/image-optimize.consumer";
import { FileUploadController } from "./file-upload.controller";
import { FileUploadRepository } from "./file-upload.repository";
import { FileUpload } from "./file-upload.schema";
import { FileUploadService } from "./file-upload.service";

@Module({
	imports: [
		AppDatabaseModule,
		AppQueueModule,
		MulterModule.register({
			dest: "./tmp/upload/origin",
		}),
		BullModule.registerQueue({
			name: fileUploadJob.name,
			defaultJobOptions: {
				attempts: 3,
				backoff: 5000,
				removeOnFail: true,
				removeOnComplete: true,
			},
		}),
	],
	controllers: [FileUploadController],
	providers: [FileUploadService, generateMongoProvider(FileUpload), FileUploadRepository, FileUploadConsumer],
})
export class FileUploadModule {}
