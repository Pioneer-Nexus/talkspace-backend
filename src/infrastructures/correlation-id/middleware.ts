import { Injectable, NestMiddleware } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import { CorrelationService } from "./service";

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
	constructor(private readonly correlationService: CorrelationService) {}

	use(req: Request, res: Response, next: NextFunction) {
		this.correlationService.runWithContext(() => {
			const correlationId = req.headers["x-correlation-id"] || uuidv4();
			this.correlationService.setCorrelationId(correlationId);

			res.setHeader("X-Correlation-Id", correlationId);

			next();
		});
	}
}
