import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IConfigAdapter } from "./adapter";
import { EnvEnum } from "./types";

@Injectable()
export class AppConfigService implements IConfigAdapter {
	constructor(private readonly config: ConfigService) {}

	DB_CONNECTION_STRING = this.config.get("DB_CONNECTION_STRING");
	ENV = this.config.get<EnvEnum>("ENV");
	IS_LOCAL = this.config.get<EnvEnum>("ENV") === EnvEnum.LOCAL;
	IS_PRODUCTION = this.config.get<EnvEnum>("ENV") === EnvEnum.PRODUCTION;
	JWT_SECRET = this.config.get<string>("JWT_SECRET");
	JWT_EXPIRED = parseInt(this.config.get<string>("JWT_EXPIRED"));
	HOST = this.config.get("HOST");
	TRACING_URL = this.config.get("TRACING_URL");
	PORT = parseInt(this.config.get<string>("PORT"));
	ELASTICSEARCH_URL = this.config.get<string>("ELASTICSEARCH_URL");
	TIME_ZONE = this.config.get<string>("TIME_ZONE");
	REDIS_URL = this.config.get<string>("REDIS_URL");
}
