const JwtStrategy = require("passport-jwt").Strategy;
const passport = require("passport");

const jwtOptions = require("../../configs/passport");
const { User } = require("../models/user");

module.exports = () => {
  const strategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    const userData = await User.findOne({ where: { email: payload.email } });
    return done(null, userData);
  });
  passport.use(strategy);
  return {
    authenticate: () => passport.authenticate("jwt", { session: false })
  };
};
