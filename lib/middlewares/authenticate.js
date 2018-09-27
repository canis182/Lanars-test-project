const JwtStrategy = require("passport-jwt").Strategy;
const passport = require("passport");

const jwtOptions = require("../../configs/passport");
const { User } = require("../models/user");

module.exports = () => {
  const strategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const userData = await User.findOne({ where: { id: payload.id } });
      if (userData !== null) {
        return done(null, userData.dataValues);
      }
     //TODO Express.error
      return done()

    } catch (err) {
      return done(err);
    }
  });
  passport.use(strategy);
  return {
    authenticate: () => passport.authenticate("jwt", { session: false })
  };
};
