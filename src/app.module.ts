import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppConfigModule } from "./infrastructures/config";

@Module({
	imports: [AppConfigModule],
	controllers: [AppController],
})
export class AppModule {}
