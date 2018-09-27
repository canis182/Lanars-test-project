const router = require("express").Router();
const auth = require('../../middlewares/authenticate');

const { 
    getUserById,
    searchUser,
    
} = require("./controller");

router
    .route('/:id')
    .get(auth().authenticate(), getUserById)

router
    .route('/')
    .get(searchUser)

module.exports = router;
