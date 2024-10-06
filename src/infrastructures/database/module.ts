import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";

import { AppConfigModule, IConfigAdapter } from "../config";

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
	],
})
export class AppDatabaseModule {}
