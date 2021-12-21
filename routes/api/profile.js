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

// @route GET api/profile
// @description Get all profiles
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/profile/user/:user_id
// @description Get all profile by user id
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);

    if(!profile) return res.status(400).json({msg: 'Profile not found'});
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json({msg: 'Profile not found'});
    }
    res.status(500).send('Server Error');
  }
});

// @route DELETE api/profile
// @description Delete profile, user and posts
// @access Private
router.delete('/', async (req, res) => {
  try {
    await Profile.findOneAndRemove({user: req.user.id});
    await User.findOneAndRemove({_id: req.user.id});
    res.json({msg: 'User deleted'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT api/profile/experience
// @description Add profile experience
// @access Private
router.put('/experience', [auth, [
    check('title', 'Title is required')
      .not()
      .isEmpty(),
    check('company', 'Company is required')
      .not()
      .isEmpty(),
    check('from', 'Starting date is required')
      .not()
      .isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({user: req.user.id});

    profile.experience.unshift(newExp);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  
});

// @route DELETE api/profile/experience/:exp_id
// @description Delete exprience from profile
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT api/profile/education
// @description Add profile education
// @access Private
router.put('/education', [auth, [
  check('school', 'School is required')
    .not()
    .isEmpty(),
  check('degree', 'Degree is required')
    .not()
    .isEmpty(),
  check('fieldOfStudy', 'Field of Study is required')
    .not()
    .isEmpty(),
  check('from', 'Starting date is required')
    .not()
    .isEmpty()
]
], async (req, res) => {
const errors = validationResult(req);
if(!errors.isEmpty()) {
  return res.status(400).json({errors: errors.array()});
}

const {
  school,
  degree,
  fieldOfStudy,
  from,
  to,
  current,
  description
} = req.body;

const newEdu = {
  school,
  degree,
  fieldOfStudy,
  from,
  to,
  current,
  description
}

try {
  const profile = await Profile.findOne({user: req.user.id});

  profile.education.unshift(newEdu);
  await profile.save();
  res.json(profile);
} catch (err) {
  console.error(err.message);
  res.status(500).send('Server Error');
}

});

// @route DELETE api/profile/education/:edu_id
// @description Delete education from profile
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;