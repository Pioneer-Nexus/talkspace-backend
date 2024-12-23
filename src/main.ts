import "./infrastructures/tracing";

import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import multipart from "fastify-multipart";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AppModule } from "./app.module";
import { IConfigAdapter } from "./infrastructures/config";
import { CorrelationService } from "./infrastructures/correlation-id";
import { ILoggerService } from "./infrastructures/logger";
import { LoggingInterceptor } from "./infrastructures/logger/interceptor";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
	const fastifyInstance = app.getHttpAdapter().getInstance();

	app.enableCors();
	await fastifyInstance.register(multipart);

	const correlation = await app.resolve(CorrelationService);
	const logger = await app.resolve(ILoggerService);

	app.useGlobalInterceptors(new LoggingInterceptor(logger, correlation));
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

	const config = app.get(IConfigAdapter);

	await app.listen(config.PORT, '0.0.0.0');
}
bootstrap();
