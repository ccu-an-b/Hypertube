const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const errors = require('../../services/utils');

router.route('/account')
    .get((req, res, next) => { // Get Connected User
        const obj = {
            googleId:undefined,
            fortyTwoId:undefined,
            githubId:undefined,
            facebookId:undefined,
        };
        if (req.user)
            Object.assign(req.user, req.user, obj);
        res.send(req.user);
    })
    .put((req, res) => { // Edit user by id
        const user = req.body;
        User.updateOne({
            _id: req.user._id,
          }, user, {
            runValidators: true
          })
        .then(() => 
            User.findOne({
                _id: req.user._id,
            })
        )
        .then(response => {
            res.json({
              status: true,
              result: response
            });
        })
        .catch(error => errors.computeDbError(res, error));
    })

router.route('/account/password')
    .put((req, res) => { // Change password
        const user = req.body;
        User.findById(req.user._id)
        .then((response) => {
            if (!user.currentPassword || !response.password)
                return  res.json({status: false,result: `Oops, some data is missing...`});
            else if (bcrypt.compareSync(user.currentPassword, response.password))
            {
                user.password = bcrypt.hashSync(user.password, 10)
                User.updateOne({
                    _id: req.user._id,
                },user, {
                    runValidators: true
                })
                .then((result) =>  res.json({status: true,result}))
            }
            else
                return  res.json({status: false,result: `Oops, your old password doesn't match`});
        })
    })
module.exports = router;