const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const errors = require('../../services/utils');

router.route('/user')
  .post((req, res) => { // Add user
    let user = new User(req.body);
    user.password = bcrypt.hashSync(user.password, 10)
    user.save()
      .then(response => {
        res.json({
          status: true,
          result: response
        });
      })
      .catch(error => errors.computeDbError(res, error));
  })

module.exports = router;