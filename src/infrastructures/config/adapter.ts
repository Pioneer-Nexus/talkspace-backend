export abstract class IConfigAdapter {
	DB_CONNECTION_STRING: string;
	ELASTICSEARCH_URL: string;
	ENV: string;
	HOST: string;
	IS_LOCAL: boolean;
	IS_PRODUCTION: boolean;
	PORT: number | string;
  TIME_ZONE: string;
	TRACING_URL: string;
}
