import helmet from 'helmet';

export const setHelmet = helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
			imgSrc: ["'self'", 'data:', 'https://docs.scalar.com'],
			connectSrc: ["'self'", 'https://raw.githubusercontent.com'],
		},
	},
});
