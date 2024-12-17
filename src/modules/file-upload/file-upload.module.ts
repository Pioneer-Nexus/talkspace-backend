import { AppDatabaseModule } from "@/infrastructures/database";
import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { ServeStaticModule } from "@nestjs/serve-static";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { FileUploadController } from "./file-upload.controller";
import { FileUploadRepository } from "./file-upload.repository";
import { FileUploadService } from "./file-upload.service";
import { FileUpload } from "./schemas/file-upload.schema";

@Module({
	imports: [
		AppDatabaseModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "../../../tmp/upload"),
		}),
		MulterModule.register({
			dest: "./tmp/upload",
			storage: diskStorage({
				destination: "./tmp/upload",
				filename: (req, file, cb) => {
					const id = Date.now() + Math.random().toString().slice(5);
					const fileExtName = extname(file.originalname);
					cb(null, `${id}${fileExtName}`);
				},
			}),
		}),
	],
	controllers: [FileUploadController],
	providers: [FileUploadService, generateMongoProvider(FileUpload), FileUploadRepository],
})
export class FileUploadModule {}
