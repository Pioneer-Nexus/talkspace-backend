import { Document } from "mongoose";

export class BaseDocument extends Document {
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}
