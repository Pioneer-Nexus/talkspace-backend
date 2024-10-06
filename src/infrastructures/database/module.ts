import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import mongoose, { Connection } from "mongoose";

import { AppConfigModule, IConfigAdapter } from "../config";

const databaseConnectionProvider = {
	provide: "DATABASE_CONNECTION",
	useFactory: (config: IConfigAdapter): Promise<typeof mongoose> =>
		mongoose.connect(config.DB_CONNECTION_STRING),
	inject: [IConfigAdapter],
};

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
	providers: [databaseConnectionProvider],
	exports: [databaseConnectionProvider],
})
export class AppDatabaseModule {}
