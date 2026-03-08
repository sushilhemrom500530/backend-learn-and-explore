import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import AppleStrategy from "passport-apple";
import dotenv from "dotenv";
import { AuthService } from "../modules/auth/auth.service";

dotenv.config();

// GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:8100/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await AuthService.findOrCreateUser({
          email: profile.emails?.[0].value || "",
          name: profile.displayName,
          provider: "google",
          providerId: profile.id,
          avatar: profile.photos?.[0].value,
        });

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

// APPLE STRATEGY
passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID!,
      teamID: process.env.APPLE_TEAM_ID!,
      keyID: process.env.APPLE_KEY_ID!,
      privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH!,
      callbackURL: "http://localhost:8100/auth/apple/callback",
      passReqToCallback: false,
      scope: ["name", "email"],
    },
    async (
      _accessToken: any,
      _refreshToken: any,
      idToken: any,
      profile: any,
      done: any,
    ) => {
      try {
        const user = await AuthService.findOrCreateUser({
          email: idToken.email,
          name: profile?.name?.firstName || "Apple User",
          provider: "apple",
          providerId: idToken.sub,
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await import("../modules/user/user.model").then((m) =>
    m.User.findById(id),
  );
  done(null, user);
});

export default passport;
