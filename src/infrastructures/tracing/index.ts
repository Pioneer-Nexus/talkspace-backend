import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core";
import { Resource } from "@opentelemetry/resources";
import * as opentelemetry from "@opentelemetry/sdk-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const exporterOptions = { url: process.env.TRACING_URL };
const traceExporter = new OTLPTraceExporter(exporterOptions);

const sdk = new opentelemetry.NodeSDK({
	resource: new Resource({
		[ATTR_SERVICE_NAME]: "talkspace-backend",
	}),
	spanProcessors: [new SimpleSpanProcessor(traceExporter) as any],
	instrumentations: [
		new HttpInstrumentation(),
		new ExpressInstrumentation(),
		new NestInstrumentation(),
		new GraphQLInstrumentation(),
	],
});

sdk.start();
console.log("Tracing initialized");

process.on("SIGTERM", () => {
	sdk.shutdown()
		.then(() => console.log("Tracing terminated"))
		.catch((error) => console.log("Error terminating tracing", error))
		.finally(() => process.exit(0));
});
