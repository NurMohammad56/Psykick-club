import passport from "passport";

// Google Callback
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = (req, res) => {
  passport.authenticate(
    "google",
    async (err, { user, accessToken, refreshToken }) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ status: false, message: "Google login failed" });
      }

      return res.json({
        status: true,
        data: user,
        accessToken,
        refreshToken,
      });
    }
  )(req, res);
};

// Facebook Callback
const facebookAuth = passport.authenticate("facebook", {
  scope: ["email"],
});

const facebookCallback = (req, res) => {
  passport.authenticate(
    "facebook",
    async (err, { user, accessToken, refreshToken }) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ status: false, message: "Facebook login failed" });
      }

      res.json({
        status: true,
        data: user,
        accessToken,
        refreshToken,
      });
    }
  )(req, res);
};

export { googleAuth, googleCallback, facebookAuth, facebookCallback };
