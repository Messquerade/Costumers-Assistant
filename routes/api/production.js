const express = require('express');
const router = express.Router();


// @route GET api/production
// @description Test router
// @access Public
router.get('/', (req, res) => res.send('Production route'));

module.exports = router;