import passport from 'passport';
import PassportJWT from 'passport-jwt';
import { Env } from '../configs/env';
import { prisma } from './prisma';

const options: PassportJWT.StrategyOptionsWithoutRequest = {
	jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: Env.jwt.secret,
};

passport.use(
	new PassportJWT.Strategy(options, async (payload, done) => {
		try {
			const admin = await prisma.admin.findFirst({ where: { emailAddress: payload.emailAddress } });
			if (admin) done(null, admin);
			else done(null, false);
		} catch (error) {
			done(null, false);
		}
	})
);

export { passport };
