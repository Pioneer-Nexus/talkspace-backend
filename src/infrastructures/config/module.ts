import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { z } from "zod";

import { ApiInternalServerException } from "@/utils/exception";
import { ZodInferSchema } from "@/utils/zod";

import { IConfigAdapter } from "./adapter";
import { AppConfigService } from "./service";
import { EnvEnum } from "./types";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [".env"],
		}),
	],
	providers: [
		{
			provide: IConfigAdapter,
			useFactory: (config: ConfigService) => {
				const ConfigSchema = z.object<ZodInferSchema<IConfigAdapter>>({
					DB_CONNECTION_STRING: z.string(),
					ENV: z.nativeEnum(EnvEnum),
					HOST: z.string(),
					PORT: z.number(),
				});
				const configData = new AppConfigService(config);

				try {
					ConfigSchema.parse(configData);
				} catch (error) {
					const message = error.issues.map(
						(i) =>
							`\n\tSecretsService.${i.path.join(".")}: ${i.message}`,
					);
					throw new ApiInternalServerException(
						message.join(""),
						error,
					);
				}

				return ConfigSchema.parse(configData);
			},
			inject: [ConfigService],
		},
	],
	exports: [IConfigAdapter],
})
export class AppConfigModule {}
