import { Injectable } from "@nestjs/common";
import { createClient, RedisClientOptions, RedisClientType } from "redis";

import { ApiInternalServerException } from "@/utils/exception";

import { ILoggerService } from "../logger";
import { ICacheService } from "./adapter";

@Injectable()
export class CacheService implements Partial<ICacheService> {
	client: RedisClientType;

	constructor(
		private readonly config: RedisClientOptions,
		private readonly logger: ILoggerService,
	) {
		logger.setContext(CacheService.name);
		this.client = createClient(this.config) as RedisClientType;
	}

	async isConnected(): Promise<void> {
		const ping = await this.client.ping();
		if (ping !== "PONG")
			new ApiInternalServerException("Redis disconnected.");
	}

	async connect(): Promise<RedisClientType> {
		try {
			await this.client.connect();
			this.logger.info("Redis connected!\n");
			return this.client;
		} catch (error) {
			throw new ApiInternalServerException(error.message, {
				context: `${CacheService.name}/connect`,
			});
		}
	}

	async set<T>(key: string, value: T, ttl: number): Promise<void> {
		await this.client.set(key, value as any, { EX: ttl });
	}

	async get<T>(key: string) {
		const getResult = (await this.client.get(key)) as T | undefined;

		return getResult;
	}

	async del(key: string): Promise<void> {
		await this.client.del(key);
	}
}
