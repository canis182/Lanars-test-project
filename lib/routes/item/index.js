const router = require("express").Router();
const auth = require('../../middlewares/authenticate');


const { 
    createItem
} = require("./controller");


router
    .route('/')
    .put(auth().authenticate(),createItem )

module.exports = router;
