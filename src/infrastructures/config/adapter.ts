export abstract class IConfigAdapter {
  IS_LOCAL: boolean;
  IS_PRODUCTION: boolean;

  ENV: string;

  PORT: number | string;

  HOST: string;

  DB_CONNECTION_STRING: string;

  TRACING_URL: string;
}
