const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const Profile = require('../../models/Profile');

// @route GET api/profile/me
// @description Get current user's profile
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);

    if(!profile) {
      return res.status(400).json({errors: [{msg: 'This user has no profile'}]});
    }
    res.json(profile);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/profile
// @description Create or update user profile
// @access Private
router.post('/', [auth, [
    check('roles', 'At least one role is required')
      .not()
      .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
  }
);


module.exports = router;