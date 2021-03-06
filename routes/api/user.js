const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');


// @route POST api/user
// @description Register user
// @access Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a password that is 6 or more characters').isLength({min: 6})
],
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

  const {name, email, password} = req.body;

  try {
    // check if user email is already in database
    let user = await User.findOne({email});

    if(user) {
      return res.status(400).json({errors: [{msg: 'User already exists'}]});
    }

    // get avatar with gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    })

    // create new user
    user = new User({
      name,
      email,
      avatar,
      password
    });
    
    // encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    }
    // generate JWT
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      {expiresIn: 360000},
      (err, token) => {
        if(err) throw err;
        res.json({token});
      });

  } catch(err) {
     console.error(err.message);
     res.status(500).send('Server error');
  }
});

module.exports = router;