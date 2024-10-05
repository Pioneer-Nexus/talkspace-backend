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

	HOST = this.config.get("HOST");

	TRACING_URL = this.config.get("TRACING_URL");

	PORT = parseInt(this.config.get<string>("PORT"));
}
