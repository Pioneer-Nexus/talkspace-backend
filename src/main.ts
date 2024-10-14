import "./infrastructures/tracing";

import { NestFactory } from "@nestjs/core";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AppModule } from "./app.module";
import { IConfigAdapter } from "./infrastructures/config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

	const config = app.get(IConfigAdapter);

	await app.listen(config.PORT);
}
bootstrap();
