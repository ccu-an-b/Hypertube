const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  userId:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'MISSING'],
  },
  movieId:{
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'MISSING'],
  },
  comment: {
    type: String,
    required: [true, 'MISSING']
  },
  timestamp : {
    type: Date, 
    default: Date.now
  },

}, { strict: true });

module.exports = mongoose.model('Comment', CommentSchema);