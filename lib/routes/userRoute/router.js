const router = require("express").Router();
const auth = require('../../middlewares/authenticate');

const { 
    registrationUser, 
    authorization,
    getCurrentUser,
    updateCurrentUser,
    getUserById,
    searchUser
} = require("./controller");

router
    .route("/register")
    .post(registrationUser);

router
    .route("/login")
    .post(authorization);

router
    .route("/me")
    .get(auth().authenticate(), getCurrentUser)
    .put(auth().authenticate(), updateCurrentUser);

router
    .route('/user/:id')
    .get(auth().authenticate(), getUserById)

router
    .route('/user')
    .get(searchUser)

module.exports = router;
