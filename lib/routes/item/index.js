const router = require("express").Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const auth = require("../../middlewares/authenticate");

const {
  createItem,
  deleteItem,
  searchItem,
  uploadImg,
  searchItems,
  updateItem,
  deleteItemImg
} = require("./controller");

router
  .route("/")
  .put(auth().authenticate(), createItem)
  .get(searchItems);

router
  .route("/:id")
  .delete(auth().authenticate(), deleteItem)
  .get(searchItem)
  .put(auth().authenticate(), updateItem);

router
  .route("/:id/image")
  .post(auth().authenticate(), upload.single("image"), uploadImg)
  .delete(auth().authenticate(), deleteItemImg);

module.exports = router;
