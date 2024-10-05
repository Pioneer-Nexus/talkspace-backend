import "./infrastructures/tracing";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { IConfigAdapter } from "./infrastructures/config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = app.get(IConfigAdapter);

	await app.listen(config.PORT);
}
bootstrap();
