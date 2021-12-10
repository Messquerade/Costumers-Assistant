const express = require('express');
const router = express.Router();


// @route GET api/costume
// @description Test router
// @access Public
router.get('/', (req, res) => res.send('Costume route'));

module.exports = router;