const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userModel = require('../models/user.model');

module.exports = {
    init: () => {
        passport.use(new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET,
                algorithms: process.env.JWT_ALGORITHM
            },
            (jwt_payload, done) => {
                userModel.findOne({ _id: jwt_payload.sub })
                    .then(user => {
                        if (!user) return done(null, false);
                        return done(null, user);
                    })
                    .catch(error => done(error, null));
            }
        ));
    },
    ensureAuthenticated: (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (error, user, info) => {
            if (info) return next(info);
            if (error) return next(error);

            if (!user) return next(new Error('You are not allowed to access'));

            // inject user data into request
            req.user = user;
            next();
        })(req, res, next);
    }
}