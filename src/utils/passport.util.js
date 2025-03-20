import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../model/user.model.js";
import { generateAccessAndRefreshTokens } from "../controller/user.controller.js";

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5001/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await generateAccessAndRefreshTokens(user._id);

        return done(null, {
          user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:5001/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"], // Make sure this is correct
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });
        if (!user) {
          user = new User({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await generateAccessAndRefreshTokens(user._id);

        return done(null, {
          user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize User
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
