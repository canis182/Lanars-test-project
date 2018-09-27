const userService = require("../../servises/userService");

exports.registrationUser = async (req, res) => {
  const userData = req.body;
  const result = await userService.registrationUser(userData);

  if (result[0].status) {
    return res.status(result[0].status).json(result[1]);
  }

  return res.json({
    token: result
  });
};

exports.authorization = async (req, res) => {
  const userData = req.body;
  const result = await userService.authorization(userData);

  if (result[0].status) {
    return res.status(result[0].status).json(result[1]);
  }

  return res.json({
    token: result
  });
};

exports.getCurrentUser = async (req, res) => {
  const userData = req.user.dataValues;
  const result = await userService.getCurrentUser(userData);

  if (result.status !== undefined) {
    return res.status(result.status).json();
  }
  return res.json(result);
};

exports.getUserById = async (req, res) => {
  const userData = req.params.id;
  const result = await userService.getUserById(userData);

  if (result.status !== undefined) {
    return res.status(result.status).json();
  }
  return res.json(result);
};

exports.searchUser = async (req, res) => {
  const { name, email } = req.query;
  const result = await userService.searchUser({ name, email });

  if (result.status !== undefined) {
    return res.status(result.status).json();
  }
  return res.json(result);
};

exports.updateCurrentUser = async (req, res) => {
  const userData = {};
  userData.newUserData = req.body;
  userData.dataUserFromToken = req.user.dataValues;
  const result = await userService.updateCurrentUser(userData);
  
    if (result[0].status) {
    return res.status(result[0].status).json(result[1]);
  }

  return res.json(result);
};
