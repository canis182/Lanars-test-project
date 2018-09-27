const router = require("express").Router();

const { 
    registrationUser, 
} = require("./controller");

router
    .route("/")
    .post(registrationUser);

module.exports = router;
