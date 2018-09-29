const ExtractJwt = require("passport-jwt").ExtractJwt;

const { access } = require("./token");

module.exports = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: access.secret,
};
