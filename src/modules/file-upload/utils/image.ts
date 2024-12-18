import { imageOptimizationConfig } from "../config/image-optimization.config";

export function getImageConfig(width: number, height: number) {
	let imageConfig = imageOptimizationConfig.at(-1);

	for (const config of [...imageOptimizationConfig].reverse()) {
		if (Math.max(width, height) < config.resolution) imageConfig = config;
	}

	return imageConfig;
}

export function getImageFieldByResolution(resolution: number) {
	return resolution;
}
