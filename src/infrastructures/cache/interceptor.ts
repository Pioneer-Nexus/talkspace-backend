import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { ICacheService } from "./adapter";
import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from "./decorators";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
	constructor(
		private readonly cacheManager: ICacheService,
		private readonly reflector: Reflector,
	) {}

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<any>> {
		const httpRequest = context.switchToHttp();
		const request = httpRequest.getNext().req;

		const cacheKey =
			this.reflector.get<string>(
				CACHE_KEY_METADATA,
				context.getHandler(),
			) || this.createCacheKey(request);

		const ttl =
			this.reflector.get<number>(
				CACHE_TTL_METADATA,
				context.getHandler(),
			) || 10;

		const cachedResponse = JSON.parse(await this.cacheManager.get(cacheKey));
		if (cachedResponse) {
			return of(cachedResponse);
		}

		return next.handle().pipe(
			tap(async (response) => {
				await this.cacheManager.set(cacheKey, JSON.stringify(response), ttl);
			}),
		);
	}

	private createCacheKey(request: any): string {
		const body = request.body;
		const query = body.query.replaceAll("\n", "").replaceAll(" ", "");
		const variable = Object.entries(body.variables)
			.sort()
			.map(([key, value]) => `${key}=${value}`)
			.join("&");

		return query + variable;
	}
}
