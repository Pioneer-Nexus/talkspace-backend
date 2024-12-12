import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { AppConfigModule, IConfigAdapter } from "../config";

@Module({
	imports: [
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			imports: [AppConfigModule],
			inject: [IConfigAdapter],
			driver: ApolloDriver,
			useFactory: async () => ({
				autoSchemaFile: "./tmp/schema.gql",
				playground: {
					settings: {
						"request.credentials": "include",
					},
				},
				cors: {
					origin: "*",
					credentials: true,
				},
				sortSchema: true,
				formatError: (error) => {
					return {
						message: error.message,
						...error.extensions,
						path: error.path,
					};
				},
			}),
		}),
	],
})
export class AppGraphQLModule {}
