const UserService = require("../../servises/userService");
const ErrorService = require("../../servises/errorService");

exports.searchUser = async (req, res) => {
  const { name, email } = req.query;
  try {
    const result = await UserService.searchUser({ name, email });
    return res.json(result);
  } catch (errors) {
    let errorsArray = errors;
    if (errors.isJoi) {
      errorsArray = ErrorService.transformJoiDetails(errors.details);
    }
    return res.status(422).json(errorsArray);
  }
};

exports.getUserById = async (req, res) => {
  const userData = req.params.id;

  try {
    const result = await UserService.getUserById(userData);
    return res.json(result);
  } catch (errors) {
    let errorsArray = errors;
    if (errors.isJoi) {
      errorsArray = ErrorService.transformJoiDetails(errors.details);
    }
    return res.status(422).json(errorsArray);
  }
};
