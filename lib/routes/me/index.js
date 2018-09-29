const router = require("express").Router();

const { 
    searchUser,
    updateCurrentUser,
} = require("./controller");

router
    .route("/")
    .get(searchUser)
    .put(updateCurrentUser);

module.exports = router;
