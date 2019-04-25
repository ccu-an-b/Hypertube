const express = require('express');
const router = express.Router();

const Movie = require('../../models/movie');

router.route('/movie/:id')
    .get((req, res) => { // Get one movie
        Movie.findById(req.params.id)
        .populate({ 
            path: 'comments',
            populate: {
            path: 'userId'
            } 
        })
        .then(response => {
            return res.json(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
    })
    .delete((req, res) => { // Delete one movie
        Movie.deleteOne({
            _id: req.query.id
        })
        .then(response => res.json(response))
        .catch(error => res.json(error));
    })

module.exports = router;