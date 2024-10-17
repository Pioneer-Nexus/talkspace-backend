import "./infrastructures/tracing";

import { NestFactory } from "@nestjs/core";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AppModule } from "./app.module";
import { IConfigAdapter } from "./infrastructures/config";
import { LoggerService } from "./infrastructures/logger";
import { LoggingInterceptor } from "./infrastructures/logger/interceptor";
import { CorrelationService } from "./infrastructures/correlation-id";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const correlation = await app.resolve(CorrelationService);
	const logger = await app.resolve(LoggerService);

	app.useGlobalInterceptors(new LoggingInterceptor(logger, correlation));
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

	const config = app.get(IConfigAdapter);

	await app.listen(config.PORT);
}
bootstrap();
