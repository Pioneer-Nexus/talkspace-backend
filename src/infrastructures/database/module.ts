import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import mongoose, { Connection } from "mongoose";

import { AppConfigModule, IConfigAdapter } from "../config";

const databaseConnectionProvider = {
	provide: "DATABASE_CONNECTION",
	useFactory: (config: IConfigAdapter): Promise<typeof mongoose> => mongoose.connect(config.DB_CONNECTION_STRING),
	inject: [IConfigAdapter],
};

export const MONGO_CONNECTION = "MONGO_CONNECTION";

@Module({
	imports: [
		MongooseModule.forRootAsync({
			connectionName: "talkspace-database",
			useFactory: (config: IConfigAdapter) => {
				const connection = {
					uri: config.DB_CONNECTION_STRING,
				};
				return {
					connectionFactory: (connection: Connection) => {
						return connection;
					},
					uri: connection.uri,
					appName: "talkspace",
				};
			},
			inject: [IConfigAdapter],
			imports: [AppConfigModule],
		}),
		AppConfigModule,
	],
	providers: [
		databaseConnectionProvider,
		{
			provide: MONGO_CONNECTION,
			useFactory: async (config: IConfigAdapter): Promise<Connection> =>
				(await mongoose.connect(config.DB_CONNECTION_STRING)).connection,
			inject: [IConfigAdapter],
		},
	],
	exports: [databaseConnectionProvider],
})
export class AppDatabaseModule {}
