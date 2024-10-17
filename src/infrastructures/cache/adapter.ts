export abstract class ICacheService {
	abstract get<T>(key: string): Promise<T | undefined>;
	abstract del(key: string): Promise<void>;
	abstract set<T>(key: string, value: T, ttl?: number): Promise<void>;
}
