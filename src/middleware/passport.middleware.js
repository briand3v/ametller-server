const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/user.model');

module.exports = {
    init: () => {
        passport.use(new LocalStrategy(
            {
                usernameField: 'username',
                passwordField: 'password'
            },
            function (username, password, done) {
                userModel.findOne({ username: username })
                    .then(user => {
                        if (!user) return done(null, false);
                        user.comparePassword(password, function (error, isMatch) {
                            if (error) return done(true);
                            if (isMatch) return done(null, user);
                            return done(null, false);
                        });
                    })
                    .catch(error => done(error, null));
            }
        ));
    },
    serializeUser: () => {
        passport.serializeUser(function (user, done) {
            const userId = typeof user._id !== undefined ? user._id : user.id;
            done(null, userId);
        })
    },
    deserializeUser: () => {
        passport.deserializeUser(function (id, done) {
            if (error) return done(true);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        });
    }
}