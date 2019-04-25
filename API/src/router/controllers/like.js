const express = require('express')
const router = express.Router()
const Movie = require('../../models/movie');

const like_switch = (movie, userid, side) => {
    const indexOfLike = movie.like.indexOf(userid)
    const indexOfDisLike = movie.dislike.indexOf(userid)

    if (indexOfLike >= 0)
        movie.like.splice(indexOfLike, 1)
    if (indexOfDisLike >= 0)
        movie.dislike.splice(indexOfDisLike, 1)
    if (side == -1 && indexOfDisLike < 0)
        movie.dislike.push(userid)
    if (side == 1 && indexOfLike < 0)
        movie.like.push(userid)
    return (movie)
}

router.route('/like')
    .post(async (req, res) => {
        movie = await Movie.findOne({
            _id: req.body.movie
        })
        movie = like_switch(movie, req.body.id, req.body.side)
        result = await Movie.updateOne({
            _id: req.body.movie
        }, movie)
        res.json({
            status: true,
            result: movie
        })
})

module.exports = router