const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const mail = require('../../services/mail');
var randomstring = require("randomstring");

router.route('/password')
  .get((req, res) => {
    User.findOne({
      key : req.query.key
    }).select("login")
    .then((result) => {
      if (!result)
        return res.json({status: false, result: `Your link is deprecated`})
      return res.json({status: true, result: result})
    })
  })
  .post((req, res) => {
    console.log(req.body)
    User.find({
      email: req.body.mail
    })
    .then((result) => {
      const user = result[0];

      if (user.fortyTwoId)
        return res.json({status: false, result: `You registered with 42, to retrieve your password got to 42.fr`}) 
      else if (user.githubId)
        return res.json({status: false, result: `You registered with GitHub, to retrieve your password got to github.com`})  
      else if (user.facebookId)
        return res.json({status: false, result: `You registered with Facebook, to retrieve your password got to facebook.com`})
      else if (user.googleId)
        return res.json({status: false, result: `You registered with Google, to retrieve your password got to google.com`})
      else {
        const key = randomstring.generate({length: 20})
        mail.password_mail(req.headers.host, user.login, user.email, key)
        User.updateOne({ _id: user._id}, {key})
        .then(() =>{
          return res.json({status: true, result: `An email has been sent to ${req.body.mail}`}) 
        }) 
      }
    })
    .catch((err) => res.json({status: false, result: `No user found for ${req.body.mail}`}))
  })
  .put((req, res) => {
    User.updateOne({
      login: req.body.login,
      key: req.body.key
    },{password: bcrypt.hashSync(req.body.password, 10), key:randomstring.generate({length: 20}) }, {
      runValidators: true
    })
    .then(() =>  res.json({status: true, result: `Your password has been updated. You can sign in.`}))
    .catch((err) => res.json({status: false, result: err}))
  })

module.exports = router;