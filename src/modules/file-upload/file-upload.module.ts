import { AppDatabaseModule } from "@/infrastructures/database";
import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { FileUploadController } from "./file-upload.controller";
import { FileUploadRepository } from "./file-upload.repository";
import { FileUploadService } from "./file-upload.service";
import { FileUpload } from "./schemas/file-upload.schema";

@Module({
	imports: [
		AppDatabaseModule,
		MulterModule.register({
			dest: "./tmp/upload/origin",
		}),
	],
	controllers: [FileUploadController],
	providers: [FileUploadService, generateMongoProvider(FileUpload), FileUploadRepository],
})
export class FileUploadModule {}
