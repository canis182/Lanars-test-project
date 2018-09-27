const userService = require("../../servises/userService");
const itemService = require("../../servises/tokenService");
const ErrorService = require("../../servises/errorService");

exports.registrationUser = async (req, res) => {
  const userData = req.body;
  try {
    const result = await userService.registrationUser(userData);
    return res.json({
      token: result
    });
  } catch (errors) {
    let errorsArray = errors;
    if (errors.isJoi) {
      errorsArray = ErrorService.transformJoiDetails(errors.details);
    }
    return res.status(422).json(errorsArray);
  }
};
