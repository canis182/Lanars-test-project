const UserService = require("../../servises/userService");
const ErrorService = require("../../servises/errorService");

exports.searchUser = async (req, res) => {
  const userData = req.user;
  try {
    const result = await UserService.searchUser(userData);
    return res.json(result);
  } catch (errors) {
    let errorsArray = errors;
    if (errors.isJoi) {
      errorsArray = ErrorService.transformJoiDetails(errors.details);
    }
    return res.status(422).json(errorsArray);
  }
};

exports.updateCurrentUser = async (req, res) => {
  const userData = req.body;
  const user = req.user;

  try {
    const result = await UserService.updateUser(user, userData);
    return res.json(result);
  } catch (errors) {
    let errorsArray = errors;
    if (errors.isJoi) {
      errorsArray = ErrorService.transformJoiDetails(errors.details);
    }
    return res.status(422).json(errorsArray);
  }
};
