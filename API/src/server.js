const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const schedule = require('node-schedule');
require('./services/passport');
const clean = require('../scripts/old_torrent');
const movieAdd = require('../scripts/last_added');
const config = require('../config/config');
const keys = require('../config/keys');
const port = process.env.PORT || 8000;

// Log requests to the console
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// MongoDb
mongoose.connect(`mongodb+srv://${config.mongo.user}:${config.mongo.password}@${config.mongo.cluster}.mongodb.net/${config.mongo.database}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("DB connection alive");
});

//CORS middleware
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'example.com');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.use(allowCrossDomain);

// Passport Auth
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)
app.use(passport.initialize());
app.use(passport.session());

// Display image
const publicDir = require('path').join(__dirname,'/public');
app.all('/public/*', function(req, res, next) {
  app.use('/public', express.static(publicDir))
  if (req.user) {
    app.use('/public', express.static(publicDir))
    next(); 
  } else {
    res.redirect("/"); 
  }
})

// Delete movie not seen for a month
schedule.scheduleJob('0 0 * * *', () => clean.getDirectories(`${__dirname}/public/torrents`));

// Add last added movies from APIs
schedule.scheduleJob('0 0 * * *', () => movieAdd.addLast());

// Router
const router = require('./router/index');
app.use('/', router);

app.listen(port);
console.log('Magic happens on port ' + port);