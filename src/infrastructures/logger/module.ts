import { Module } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER, WinstonModule } from "nest-winston";
import * as winston from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { AppConfigModule, IConfigAdapter } from "../config";
import { LoggerService } from "./service";
import { CorrelationModule, CorrelationService } from "../correlation-id";
import { ILoggerService } from "./adapter";
import { Logger } from "winston";

@Module({
	imports: [
		CorrelationModule,
		WinstonModule.forRootAsync({
			imports: [AppConfigModule],
			inject: [IConfigAdapter],
			useFactory: (config: IConfigAdapter) => ({
				level: "info",
				format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.colorize(),
					winston.format.printf(({ timestamp, level, message, context }) => {
						return `[Winston] - ${new Intl.DateTimeFormat("en-GB", {
							dateStyle: "short",
							timeStyle: "long",
							timeZone: config.TIME_ZONE,
						}).format(new Date(timestamp as string))} - [${context}] ${level}: ${message}`;
					}),
				),
				transports: [
					new winston.transports.Console({}),
					new ElasticsearchTransport({
						level: "info",
						clientOpts: {
							node: config.ELASTICSEARCH_URL,
						},
						index: "app-logs",
					}),
				],
			}),
		}),
	],
	providers: [
		{
			provide: ILoggerService,
			useFactory(logger: Logger, correlationService: CorrelationService) {
				return new LoggerService(logger, correlationService);
			},
			inject: [WINSTON_MODULE_PROVIDER, CorrelationService],
		},
	],
	exports: [ILoggerService],
})
export class AppLoggerModule {}
