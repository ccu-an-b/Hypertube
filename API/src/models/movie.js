const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  src_id: {
    type: String,
    unique: true,
    required: [true, 'MISSING'],
  },
  moviedb_id: {
    type: String,
    unique: true,
    required: [true, 'MISSING'],
  },
  imdb_id: {
    type: String,
    unique: true,
    required: [true, 'MISSING'],
  },
  src: {
    type: String,
    required: [true, 'MISSING'],
  },
  original_title: {
    type: String,
    required: [true, 'MISSING'],
  },
  title: {
    type: {},
    required: [true, 'MISSING'],
  },
  year: {
    type: Number,
    required: [true, 'MISSING'],
  },
  rating: {
    type: Number,
    required: [true, 'MISSING'],
  },
  popularity: {
    type: Number,
  },
  genre: {
    type: [],
    required: [true, 'MISSING'],
  },
  synopsis: {
    type: {},
    required: [true, 'MISSING'],
  },
  img: {
    type: String,
    required: [true, 'MISSING'],
  },
  trailer: {
    type: {},
    required: [true, 'MISSING'],
  },
  torrents: {
    type: [],
    required: [true, 'MISSING'],
  },
  runtime: {
    type: Number,
    required: [true, 'MISSING'],
  },
  cast:{
    type: [],
  },
  director:{
    type: String,
  },
  language: {
    type: String,
  },
  path: {
    type: String,
  },
  hash: {
    type: String,
  },
  comments:[{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: []
  }],
  like: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  dislike: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  subtiles: {
    type: Array
  },
  seen: {
    type: Date, 
  }
}, { strict: true });

module.exports = mongoose.model('Movie', MovieSchema);