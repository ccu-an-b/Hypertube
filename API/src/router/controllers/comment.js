const express = require('express');
const router = express.Router();
const Comment = require('../../models/comment');
const Movie = require('../../models/movie');

router.route('/comment')
    .get((req, res) => { // Get All Comments
        Comment.find({})
        .then(response => {
            res.json(response);
          })
    })
    .post(async (req, res) => { // Add Comment
        const comment = new Comment(req.body);
        comment.userId = req.user._id;
        const new_comment = await comment.save()

        await  Movie.updateOne({
            _id: req.body.movieId
        },{
            $push: { comments: new_comment._id }
        });

        const comments = await Movie.findById(req.body.movieId)
            .populate({ 
                path: 'comments',
                populate: {
                path: 'userId'
                } 
            }).select('comments')
        return res.json({
            status: true,
            result: comments
        });
      })
    .delete(async (req, res) => { // Delete Comment
        await Movie.updateOne({ 
                _id: req.query.movie},{
                $pull: { comments: req.query.id }
            })  
        await Comment.deleteOne({
            _id: req.query.id,
            userId: req.user._id
        })

        const comments = await Movie.findById(req.query.movie)
        .populate({ 
            path: 'comments',
            populate: {
            path: 'userId'
            } 
        }).select('comments')

        return res.json({status: true, result:comments})
    })

module.exports = router;