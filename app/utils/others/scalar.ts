import { apiReference } from '@scalar/express-api-reference';

export const setScalar = apiReference({
	theme: 'kepler',
	hideModels: true,
	tagsSorter: 'alpha',
	forceDarkModeState: 'dark',
	defaultOpenAllTags: true,
	spec: { url: 'https://raw.githubusercontent.com/irfnd/irfandi-betest/refs/heads/master/openapi.yaml' },
	favicon: 'https://docs.scalar.com/favicon.svg',
	defaultHttpClient: { targetKey: 'node', clientKey: 'fetch' },
	metaData: {
		title: 'Technical Test - Documentation',
		description: 'API documentation for technical test Irfandi',
	},
});
