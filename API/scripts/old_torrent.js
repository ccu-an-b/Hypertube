const { lstatSync, readdirSync} = require('fs')
const { join } = require('path')
const Movie = require('../src/models/movie');
const rimraf = require("rimraf");
const isDirectory = source => lstatSync(source).isDirectory()

const getDirectories = source =>
  readdirSync(source).map(name => {
    isRecent(name)
    return join(source, name)
}).filter(isDirectory)

const isOlder = (seen) => {
    const today = Date.now();
    const lastSeen = new Date(seen);
    const difference = today - lastSeen; 
    const oneMonth = 1000 * 60 * 24 * 7 * 30;

    return Math.floor(difference / oneMonth) >= 30; 
}

const isRecent = (name) => {
    Movie.findOne({
        hash:name
    })
    .then((movie) => {
        if (movie){
            if (isOlder(movie.seen))
            {
                rimraf(`${__dirname}/../src/public/torrents/${name}`, () => console.log(movie.title.en,' was deleted'))
            }
        }
    })
    .catch((err) => console.log(err))
}

module.exports = {
    getDirectories
}