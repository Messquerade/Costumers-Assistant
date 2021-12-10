const express = require('express');
const router = express.Router();


// @route GET api/user
// @description Test router
// @access Public
router.get('/', (req, res) => res.send('User route'));

module.exports = router;