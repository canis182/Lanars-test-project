const JwtStrategy = require("passport-jwt").Strategy;
const passport = require("passport");

const jwtOptions = require("../../configs/passport");
const { User } = require("../models");

module.exports = () => {
  const strategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const userData = await User.findOne({ where: { id: payload.id } });
      if (userData !== null) {
        return done(null, userData.dataValues);
      }
      return done(null, false);
    } catch (err) {
      return done(err);
    }
  });
  passport.use(strategy);
  return {
    authenticate: () => passport.authenticate("jwt", { session: false })
  };
};
