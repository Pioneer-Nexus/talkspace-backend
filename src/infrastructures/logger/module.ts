import { Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { AppConfigModule, IConfigAdapter } from "../config";
import { LoggerService } from "./service";

@Module({
	imports: [
		WinstonModule.forRootAsync({
			imports: [AppConfigModule],
			inject: [IConfigAdapter],
			useFactory: (config: IConfigAdapter) => ({
				level: "info",
				format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.colorize(),
					winston.format.printf(
						({ timestamp, level, message, context }) => {
							return `[Winston] - ${new Intl.DateTimeFormat(
								"en-GB",
								{
									dateStyle: "short",
									timeStyle: "long",
									timeZone: config.TIME_ZONE,
								},
							).format(
								new Date(timestamp),
							)} - [${context}] ${level}: ${message}`;
						},
					),
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
	providers: [LoggerService],
	exports: [LoggerService],
})
export class AppLoggerModule {}
