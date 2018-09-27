const UserService = require("../../servises/userService");
const itemService = require("../../servises/tokenService");
const ErrorService = require('../../servises/errorService');

exports.createItem = async (req, res) => {
  const data = {};
  data.newItemData = req.body;
  data.dataUserFromToken = req.user.dataValues;

  const result = await itemService.createItem(data);
};
