const router = require("express").Router();
const auth = require('../../middlewares/authenticate');

const { 
    getCurrentUser,
    updateCurrentUser,
} = require("./controller");

router
    .route("/")
    .get(auth().authenticate(), getCurrentUser)
    .put(auth().authenticate(), updateCurrentUser);

module.exports = router;
