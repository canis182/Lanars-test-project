const router = require('express').Router();

const {
    registrationUser,
    authorization
} = require('./controller')

router
    .route('/register')
    .post(registrationUser)

router
    .route('/login')
    .post(authorization)

module.exports = router;
