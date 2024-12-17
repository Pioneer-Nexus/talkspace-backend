import "./infrastructures/tracing";

import { NestFactory } from "@nestjs/core";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AppModule } from "./app.module";
import { IConfigAdapter } from "./infrastructures/config";
import { CorrelationService } from "./infrastructures/correlation-id";
import { ILoggerService } from "./infrastructures/logger";
import { LoggingInterceptor } from "./infrastructures/logger/interceptor";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();

	const correlation = await app.resolve(CorrelationService);
	const logger = await app.resolve(ILoggerService);

	app.useGlobalInterceptors(new LoggingInterceptor(logger, correlation));
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

	const config = app.get(IConfigAdapter);

	await app.listen(config.PORT);
}
bootstrap();
