import { Module } from "@nestjs/common";
import { ISseService } from "./sse.adapter";
import { SseService } from "./sse.service";

@Module({
	providers: [
		{
			provide: ISseService,
			useClass: SseService,
		},
	],
	exports: [
		{
			provide: ISseService,
			useClass: SseService,
		},
	],
})
export class SseModule {}
