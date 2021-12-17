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

    const {
      companies,
      website,
      location,
      roles,
      bio,
      twitter,
      facebook,
      linkedin,
      instagram  
    } = req.body;

    const profileFields = {};

    profileFields.user = req.user.id;
    if(companies) {
      profileFields.companies = companies.split(',').map(company => company.trim());
    }
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(roles) {
      profileFields.roles = roles.split(',').map(role => role.trim());
    }
    if(bio) profileFields.bio = bio;
    if(twitter) profileFields.twitter = twitter;
    if(facebook) profileFields.facebook = facebook;
    if(linkedin) profileFields.linkedin = linkedin;
    if(instagram) profileFields.instagram = instagram;
    

    profileFields.social = {};
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    
    try {
      // check if profile already exists for user
      let profile = await Profile.findOne({user: req.user.id});
      
      // Update existing profile if found
      if(profile) {
        profile = await Profile.findOneAndUpdate(
          {user: req.user.id},
          {$set: profileFields},
          {new: true}
          );

        return res.json(profile);
      }

      // Create a new profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);

    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

  }
);


module.exports = router;