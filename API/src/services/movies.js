const axios = require('axios');
const Movie = require('../models/movie');
const key = require(__dirname+'/../../config/keys');

const ratingInterval = (min, max) => {
    const value = 100*min+ max;
    let res;

    switch (value){
        case 0:
            res =  0;
            break;
        case 10:
            res = undefined;
            break;
        case 1010:
            res = 10;
            break;
        default:
            if (max === 10)
                res = {$gt: min};
            else if (min === 0)
                res = {$lte: max};
            else
                res = {$gt:min , $lte: max};
            break;
    }
    return res;
}

const findTrailer = (array) => {
    if (array){
      return array.find(arr => {
        if (arr && arr.type === 'Trailer')
            return arr.key
        else return undefined;
      });
    }
    return undefined
  }

  const arrTrailer = (en, fr, esp) => {
    const enTrailer = findTrailer(en)
    const frTrailer =findTrailer(fr) || findTrailer(en)
    const espTrailer = findTrailer(esp) || findTrailer(en)
    
    const trailers = {
      'en': enTrailer.key,
      'fr': frTrailer.key|| enTrailer.key,
      'esp': espTrailer.key||enTrailer.key,
    }
    return trailers;
}

const findDirector = (array) => {
    return array.find(arr => {
        if (arr && arr.job === 'Director')
            return arr.name
        else return undefined;
    } );
}
const mapAllMovies = async (movies, source) => {
    let i =0 ;
    do {
        await mapMovie(movies[i], source)
        i += 1
    } while (i < 50)
}

const mapMovie = async (movie, src) => {
    try {
        const imdbId = src === 'YTS' ? movie.imdb_code : movie.imdb_id;
        const enInfo = await axios.get(`https://api.themoviedb.org/3/find/${imdbId}?api_key=${key.moviedbKey}&language=en-EN&external_source=imdb_id`);
        const frInfo = await axios.get(`https://api.themoviedb.org/3/find/${imdbId}?api_key=${key.moviedbKey}&language=fr-Fr&external_source=imdb_id`);
        const espInfo = await axios.get(`https://api.themoviedb.org/3/find/${imdbId}?api_key=${key.moviedbKey}&language=esp-ES&external_source=imdb_id`);
        const credits = await axios.get(`https://api.themoviedb.org/3/movie/${enInfo.data.movie_results[0].id}/credits?api_key=${key.moviedbKey}`);
        const enTrailer =  await axios.get(`https://api.themoviedb.org/3/movie/${enInfo.data.movie_results[0].id}/videos?api_key=${key.moviedbKey}&language=en-EN`);
        const frTrailer =  await axios.get(`https://api.themoviedb.org/3/movie/${enInfo.data.movie_results[0].id}/videos?api_key=${key.moviedbKey}&language=fr-FR`);
        const espTrailer = await axios.get(`https://api.themoviedb.org/3/movie/${enInfo.data.movie_results[0].id}/videos?api_key=${key.moviedbKey}&language=esp-ES`);
        const director = findDirector(credits.data.crew);

        const res =  {
            src_id: src === 'YTS' ? movie.id :movie._id,
            moviedb_id: enInfo.data.movie_results[0].id,
            imdb_id: imdbId,
            src: src,
            original_title:enInfo.data.movie_results[0].original_title,
            title: {'en': enInfo.data.movie_results[0].title, 
                    'fr': frInfo.data.movie_results[0].title, 
                    'esp': espInfo.data.movie_results[0].title},
            year: movie.year,
            rating: enInfo.data.movie_results[0].vote_average,
            popularity: enInfo.data.movie_results[0].popularity,
            genre: enInfo.data.movie_results[0].genre_ids,
            synopsis:{  'en': enInfo.data.movie_results[0].overview, 
                        'fr': frInfo.data.movie_results[0].overview !== "" ? frInfo.data.movie_results[0].overview : '[Anglais] '+enInfo.data.movie_results[0].overview, 
                        'esp': espInfo.data.movie_results[0].overview!== "" ? espInfo.data.movie_results[0].overview : '[Inglés] '+enInfo.data.movie_results[0].overview },
            img: src === 'YTS' ? movie.large_cover_image : movie.images.poster,
            trailer: arrTrailer(enTrailer.data.results, frTrailer.data.results, espTrailer.data.results),
            torrents: movie.torrents,
            runtime: movie.runtime,
            language:movie.language,
            cast: [credits.data.cast[0].name, credits.data.cast[1].name, credits.data.cast[2].name, credits.data.cast[3].name, credits.data.cast[4].name],
            director: director.name
        }
        const newMovie = new Movie(res);
        newMovie.save()
        .then(() => console.log(`${enInfo.data.movie_results[0].original_title} was added to the Database`))
        .catch((error) => console.log(`${enInfo.data.movie_results[0].original_title} already exists`));

    } catch(error){
        return false;
    }
}

const fetch50Movies = async (page) => {
    const ytsData = await axios.get(`https://yts.am/api/v2/list_movies.json`, {
        params: {
          limit: '50',
          sort_by: 'rating',
          order_by: 'desc',
          page: page
        }
      });
      await mapAllMovies(ytsData.data.data.movies, 'YTS');
      const popcornData = await axios.get(`https://tv-v2.api-fetch.website/movies/${page}`, {
        params: {
          order: -1, 
        }
      });
      await mapAllMovies(popcornData.data, 'popcorn');
}

const fetch50LastAdded = async (page) => {
    const ytsData = await axios.get(`https://yts.am/api/v2/list_movies.json`, {
        params: {
          limit: '50',
          sort_by: 'date_added',
          order_by: 'desc',
          page: page
        }
      });
    await mapAllMovies(ytsData.data.data.movies, 'YTS');
      const popcornData = await axios.get(`https://tv-v2.api-fetch.website/movies/${page}`, {
        params: {
          sort: 'last added',
          order: -1
        }
      });
    await mapAllMovies(popcornData.data, 'popcorn');
}


module.exports = {
    fetch50LastAdded,
    fetch50Movies,
    ratingInterval
}
