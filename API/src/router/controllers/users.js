const express = require('express');
const router = express.Router();

const User = require('../../models/user');

router.route('/users')
  .get((req, res) => { // get all users
    User.find({}).select("-_id -googleId -fortyTwoId -githubId -facebookId -password -key").sort('firstname')
      .then(response => {
        res.json(response);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  })
  .delete((req, res) => { // Delete all users
    User.deleteMany({})
      .then(response => {
        res.json(response);
      })
      .catch(err => {
        res.status(500).send(err);
      });

  })

module.exports = router;