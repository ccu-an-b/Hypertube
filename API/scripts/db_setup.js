const fetch = require('../src/services/movies');
const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.connect(`mongodb+srv://${config.mongo.user}:${config.mongo.password}@${config.mongo.cluster}.mongodb.net/${config.mongo.database}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("DB connection alive");
});


const addMovie = async (startPage, endPage) => {
    let i = startPage;
    do {
        await fetch.fetch50Movies(i);
        i += 1
    } while (i < endPage)
}

// Add movies to your db
addMovie(70,75)