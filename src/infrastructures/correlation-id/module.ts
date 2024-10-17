import { Module } from "@nestjs/common";
import { CorrelationService } from "./service";

@Module({
	providers: [CorrelationService],
	exports: [CorrelationService],
})
export class CorrelationModule {}
