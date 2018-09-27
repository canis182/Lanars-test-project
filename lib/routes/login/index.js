const router = require("express").Router();

const { 
    authorization,
} = require("./controller");

router
    .route("/")
    .post(authorization);

module.exports = router;
