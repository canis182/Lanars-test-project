const userService = require("../../servises/userService");
const ErrorService = require("../../servises/errorService");

exports.authorization = async (req, res) => {
  const userData = req.body;
  try {
    const result = await userService.authorization(userData);
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
