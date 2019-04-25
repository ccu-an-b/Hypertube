const express = require('express');
const router = express.Router();

const User = require('../../models/user');
const errors = require('../../services/utils');

router.route('/profile')
    .get((req, res) => { // Get user profile by login
        User.find({	   
            login: req.query.login	      
        }).select("-_id -googleId -fortyTwoId -githubId -facebookId -password -key").populate('mylist').populate('seen')    
        .then(response => {	   
            res.json({       
            status: true,
            result: response[0]
            });
        })	   
        .catch(error => errors.computeDbError(res, error));
    })

module.exports = router;