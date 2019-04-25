const express = require('express');
const router = express.Router();
const torrents = require('../../services/torrents');
const torrentStream = require('torrent-stream');
var fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const Movie = require('../../models/movie');
let isDownload = [];

const stream = (res, range,path, file) => {
    let fileSize;
    if (file)
        fileSize = file.length;

    else {
        const stat = fs.statSync(path);
        fileSize = stat.size
    }

    if(torrents.extentionIsMkv(path)){
            const head = {
                'Content-Type': 'video/mp4',
                }
            res.writeHead(200, head)
            const stream = fs.createReadStream(path);
            ffmpeg()
            .input(stream)
            .outputOptions('-movflags frag_keyframe+empty_moov')
            .audioCodec('aac')
            .videoCodec('libx264')
            .outputFormat('mp4')
            .on('error', err => {})
            .pipe(res)
            res.on('close', () => {
                stream.destroy()
            })
    }
    else if (range) {
        const chunk = torrents.getChunk(range, fileSize)
        
        const stream = fs.createReadStream(path, {start: chunk.start, end: chunk.end})
        const head = {
            'Content-Range': `bytes ${chunk.start}-${chunk.end}/${chunk.fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunk.size,
            'Content-Type': 'video/mp4',
            'Connection': 'keep-alive'
        }
        console.log("CHUNK", chunk);
        console.log("HEAD", head);
        res.writeHead(206, head);
        stream.pipe(res);
    } else {
        const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
}


const download = async (req, res, movie, hash) => {
    const magnet = torrents.getMagnet(hash);
    const path = `${__dirname}/../../public`;
    let videoFile = undefined;

    let engine = torrentStream(magnet, {
        path: `${path}/torrents/${hash}`,
        tmp: `${path}/tmp/`,
        verify: true, 
    });

    torrents.createFolders(path, hash);

    engine.on('ready', () => {
        engine.files.forEach((file) => {
            if (torrents.extentionIsCompatible(file.name) && !videoFile ) {
                videoFile = file;
                if (!movie.path || !fs.existsSync(`${__dirname}/../..${movie.path}`)) {
                    torrents.getSubtiles(movie, `/public/torrents/${hash}/`);
                    movie.path = `/public/torrents/${hash}/${file.path}`;
                    movie.hash = hash;
                    file.select();
                    console.log('--- DOWNLOAD:', file.name);
                }
            } 
            else 
                file.deselect(); 
        });
        movie.save()    
    }).on('download', (pieceIndex) => {
        const completion = Math.round((100 * engine.swarm.downloaded) / videoFile.length);
        torrents.printProgress(completion, engine.swarm.downloaded, videoFile.length, videoFile.name);
        if (!isDownload[movie.id] && completion > 4  ){
            isDownload[movie.id]= engine.swarm.downloaded;
            stream(res, req.headers.range,`${__dirname}/../..${movie.path}`, videoFile);
        }
    }).on('idle', () => {
        if (isDownload[movie.id] && isDownload[movie.id] >= videoFile.length){
            isDownload[movie.id] = false;   
            console.log('--- DOWNLOAD COMPLETE', videoFile.name)
        }
        else
            console.log('--- DOWNLOADING STILL', videoFile.name)
        engine.removeAllListeners();
        engine.destroy();
    });
}

router.route('/play')
    .get((req, res) => {
        if (!req.session || !req.session.passport)
            return res.redirect("/"); 
        Movie.findById(req.query.id)
            .then( async (movie) => {
                movie.seen = Date.now();
                await movie.save();
                if (movie.hash && fs.existsSync(`${__dirname}/../..${movie.path}`)){
                    stream(res, req.headers.range , `${__dirname}/../..${movie.path}`, false)
                }
                else {
                    const hash = torrents.getHash(movie);
                    download(req, res, movie, hash);
                }
            })
            .catch(err => {
                console.warn(err)
                res.json({
                    status: false,
                    error: err.message
                });
            }); 
    })
module.exports = router;