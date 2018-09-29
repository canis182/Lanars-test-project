const router = require("express").Router();
const auth = require('../../middlewares/authenticate');

const { 
    searchUserById,
    searchUserByUrl,
    
} = require("./controller");

router
    .route('/:id')
    .get(auth().authenticate(), searchUserById)

router
    .route('/')
    .get(searchUserByUrl)

module.exports = router;
