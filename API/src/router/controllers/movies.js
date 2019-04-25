const express = require('express');
const router = express.Router();
const axios = require('axios');

const Movie = require('../../models/movie');
const fetch = require('../../services/movies');

router.route('/movies')
.get( async (req, res) => {
  try {
    let sort = req.query.sort || "rating";
    const page = req.query.page || 1;
    let order = req.query.order || -1;
    const rating = fetch.ratingInterval(parseInt(req.query.ratingMin,10), parseInt(req.query.ratingMax,10))
    let params = {  year: {$gt: parseInt(req.query.yearMin,10) - 1, $lte: parseInt(req.query.yearMax,10) + 1}};
    
    if ( req.query.genre )
      params.genre= {$all: [parseInt(req.query.genre)]};
    if (rating || rating === 0)
      params.rating= rating; 


    if (req.query.title){
      const partialMatch = new RegExp(`${req.query.title.replace('+', ' ')}`, 'i');
      params = {...params, '$or':[ {"title.en": partialMatch},{"title.fr": partialMatch}, {"title.es": partialMatch} ] }
      if (!req.query.sort){
        sort = `title.${req.user.language}`;
        if (!req.query.order)
          order = 1;
      }
    }

    const movies = await Movie.find(params).limit(50).skip((page-1)*50).sort({ [sort]: order })
    const count = await Movie.find(params).sort({ [sort]: order }).countDocuments();

    return res.json({count, movies})
    
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
})
.delete((req, res) => { 
  Movie.deleteMany({})
    .then(response => res.json(response))
    .catch(error => res.json(error));
})

router.route('/moviesfetch')
  .get(async (req, res) => { // Get movies by pages
    try {
      let i = 60;
      do {
        await fetch.fetch50Movies(i);
        i += 1
    } while (i < 61)
      return res.json({ status: true, result: 'DB Filled',})
    } catch(error) {
      res.json({ status: false, result: error});
    }
  })

module.exports = router;