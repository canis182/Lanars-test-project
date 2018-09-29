const itemService = require("../../servises/itemService");
const ErrorService = require("../../servises/errorService");

exports.createItem = async (req, res) => {
  const newItem = req.body;
  const user = req.user;
  try {
    const result = await itemService.createItem(user, newItem);
    return res.json({
      result
    });
  } catch (errors) {
    let errorsArray = errors;
    if (errors.isJoi) {
      errorsArray = ErrorService.transformJoiDetails(errors.details);
    } else if (errors.status === 403) {
      return res.status(403).json();
    }

    return res.status(422).json(errorsArray);
  }
};

exports.deleteItem = async (req, res) => {
  const idItem = req.params.id;
  const user = req.user;
  try {
    await itemService.deleteItem(user, idItem);
    return res.json();
  } catch (err) {
    return res.status(err.status).json();
  }
};

exports.searchItem = async (req, res) => {
  const idItem = req.params.id;
  try {
    const result = await itemService.searchItem(idItem);
    return res.json({
      result
    });
  } catch (err) {
    return res.status(err.status).json();
  }
};

exports.uploadImg = async (req, res) => {
  const user = req.user;
  const idItem = req.params.id;
  const img = req.files.image;
  try {
    const result = await itemService.uploadImg(idItem, img, user);
    return res.json({
      result
    });
  } catch (err) {
    if (err.status !== undefined) {
      return res.status(err.status).json();
    }
    return res.status(500).json();
  }
};

exports.searchItems = async (req, res) => {
  const data = req.query;
  try {
    const result = await itemService.searchItems(data);
    return res.json({
      result
    });
  } catch (err) {
    return res.status(err.status).json();
  }
};

exports.updateItem = async (req, res) => {
  const idItem = req.params.id;
  const newItemData = req.body;
  const user = req.user;
  try {
    const result = await itemService.updateItem(idItem, newItemData, user);
    return res.json({
      result
    });
  } catch (errors) {
    let errorsArray = errors;
    if (errors.isJoi) {
      errorsArray = ErrorService.transformJoiDetails(errors.details);
    } else if (errors.status !== undefined) {
      return res.status(errors.status).json();
    }
    return res.status(422).json(errorsArray);
  }
};

exports.deleteItemImg = async (req, res) => {
  const idItem = req.params.id;
  const user = req.user;
  try {
    const result = await itemService.deleteItemImg(idItem, user);
    return res.json({
      result
    });
  } catch (errors) {
    let errorsArray = errors;
    if (errors.isJoi) {
      errorsArray = ErrorService.transformJoiDetails(errors.details);
    } else if (errors.status !== undefined) {
      return res.status(errors.status).json();
    }

    return res.status(422).json(errorsArray);
  }
};
