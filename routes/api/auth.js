const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');


// @route GET api/auth
// @description Test router
// @access Public
router.get('/', auth, (req, res) => res.send('Auth route'));

module.exports = router;