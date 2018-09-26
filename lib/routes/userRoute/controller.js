const userService = require('../../servises/userService');

exports.registrationUser = async (req, res) => {
  const userData = req.body;
  const result = await userService.registrationUser(userData);
  const resultKey = Object.keys(result);

  if (resultKey[0] === "status") {
    return res.status(result.status).json({
      name: result,
      message: result.message.message
    });
  }

  return res.json({
    token: result
  });
};

exports.authorization = async (req, res) => {
  const userData = req.body;
  const result = await userService.authorization(userData);
};
