const express = require('express');
const router = express.Router();
const User = require('../../models/user');


router.route('/mylist')
    .get((req, res) => {
        User.findById(req.user._id)
        .populate('mylist')
        .then((response) => res.json({status: true, result: response.mylist}))
    })
    .post((req,res) => {
        User.updateOne({
            _id: req.user._id
        },{
            $push: { mylist: req.body.movie }
        })
        .then((res) => User.findById(req.user._id))
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
            $pull: { mylist: req.query.movie }
        })
        .then((res) => User.findById(req.user._id))
        .then(response => {
            res.json({
            status: true,
            result: response
            });
        })
    })

module.exports = router;