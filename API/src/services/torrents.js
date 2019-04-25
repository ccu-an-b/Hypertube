var fs = require('fs');
const readline = require('readline');
const yifysubtitles = require('yifysubtitles');

const printProgress = (progress, a, b, c) => {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write('Completion ' + progress + '% ' + a + '/' + b + ' => ' + c);
}

const getMagnet = (hash) => {
    return `magnet:?xt=urn:btih:${hash}`;
}

const extentionIsCompatible = (str) => {
    const ext = str.split('.').pop()
    return ext === 'mkv' || ext === 'mp4'
}

const extentionIsMkv = (str) => {
    const ext = str.split('.').pop();
    return ext === 'mkv';
}

const createFolders = (path, hash) => {
    if (!fs.existsSync(`${path}/tmp`)) {
        fs.mkdirSync(`${path}/tmp`);
    }
    if (!fs.existsSync(`${path}/torrents`)) {
        fs.mkdirSync(`${path}/torrents`);
    }
    if (!fs.existsSync(`${path}/torrents/${hash}`)) {
        fs.mkdirSync(`${path}/torrents/${hash}`);
    }
}

const getHash = (movie) => {
    if (movie.src === 'YTS') {
        return movie.torrents && movie.torrents[0] ? movie.torrents[0].hash : false;
    } else {
        if (movie.torrents[0].en){
            let url = movie.torrents[0].en['720p'].url || movie.torrents[0].en['1080p'].url ;
            url = url.match(/(?<=magnet:\?xt=urn:btih:)[a-zA-Z0-9]*/g)
            return url[0] ? url[0] : false;
        }
        else if (movie.torrents[0].fr){
            let url =  movie.torrents[0].fr['720p'].url || movie.torrents[0].fr['1080p'].url ;
            url = url.match(/(?<=magnet:\?xt=urn:btih:)[a-zA-Z0-9]*/g)
            return url[0] ? url[0] : false;
        }
    }
}

const getSubtiles = (movie, path) => {
    yifysubtitles(movie.imdb_id, {
        path: `${__dirname}/../${path}`,
        langs: ['en', 'fr', 'es']
    })
    .then(res => {
        movie.subtiles = res.map(sub => {
            return {
                lang: sub.langShort === 'es' ? 'esp' : sub.langShort,
                label: sub.lang,
                path: `${path}/${sub.fileName}`
            }
        })
        movie.save();
    }).catch(err => {
        console.log(err);
        reject(err.message)
    })
}

const getChunk = (range, fileSize) => {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const size = (end - start) + 1
    return {
        start,
        end,
        size,
        fileSize
    }
}

module.exports = {
    printProgress,
    getMagnet,
    extentionIsCompatible,
    extentionIsMkv,
    createFolders,
    getHash,
    getSubtiles,
    getChunk,
}
