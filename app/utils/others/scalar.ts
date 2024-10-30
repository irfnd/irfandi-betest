import { apiReference } from '@scalar/express-api-reference';
import fs from 'fs';
import { parse as parseYaml } from 'yaml';

const OpenApiFile = fs.readFileSync(__dirname + '/openapi.yaml', { encoding: 'utf8' });
const OpenApiSpec = parseYaml(OpenApiFile);

export const setScalar = apiReference({
	theme: 'kepler',
	hideModels: true,
	tagsSorter: 'alpha',
	forceDarkModeState: 'dark',
	defaultOpenAllTags: true,
	spec: { content: OpenApiSpec },
	favicon: 'https://docs.scalar.com/favicon.svg',
	defaultHttpClient: { targetKey: 'node', clientKey: 'fetch' },
	metaData: {
		title: 'Technical Test - Documentation',
		description: 'API documentation for technical test Irfandi',
	},
});
