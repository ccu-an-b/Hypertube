const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.route('/seen')
    .post((req,res) => {
        User.updateOne({
            _id: req.user._id
        },{
            $push: { seen: req.body.movie }
        })
        .then(() => User.findById(req.user._id))
        .then(response => {
            res.json({
            status: true,
            result: response
            });
        })
    })
    .delete((req,res) => {
        User.updateOne({
            _id: req.user._id
        },{
            $pull: { seen: req.body.movie }
        })
        .then(() => User.findById(req.user._id))
        .then(response => {
            res.json({
            status: true,
            result: response
            });
        })
    })

module.exports = router;