import { Connection, Schema } from "mongoose";

export function generateMongoProvider<T>(
	type: { new (value: T): T },
	schema: Schema<T>,
) {
	return {
		provide: type.name,
		useFactory: (connection: Connection) =>
			connection.model(type.name, schema),
		inject: ["DATABASE_CONNECTION"],
	};
}
