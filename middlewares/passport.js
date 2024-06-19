const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
require('dotenv').config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;
            try {
                let user = await User.findOne({ username: email });
                if (user) {
                    return done(null, user);
                }
                user = await User.create({ username: email });
                return done(null, user);
            } catch (err) {
                console.error(`err: ${err}`);
                return done(err, null);
            }
            // eslint-disable-next-line comma-dangle
        }
        // eslint-disable-next-line comma-dangle
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
