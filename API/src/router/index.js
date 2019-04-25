const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use((req, res, next) => {
  console.log('Something is happening.');
  next();
});

router.use('/api',require('./controllers/user'));
router.use('/api',require('./controllers/password'));
router.use('/api', require('./controllers/upload'));
router.use(require('./controllers/auth'));
router.use('/api', require('./controllers/play'));
router.use('/api', passport.authenticate('jwt'),require('./controllers/users'));
router.use('/api', passport.authenticate('jwt'),require('./controllers/movie'));
router.use('/api', passport.authenticate('jwt'),require('./controllers/movies'));
router.use('/api', passport.authenticate('jwt'),require('./controllers/like'));
router.use('/api', passport.authenticate('jwt'),require('./controllers/profile'));
router.use('/api', passport.authenticate('jwt'), require('./controllers/comment'));
router.use('/api', passport.authenticate('jwt'), require('./controllers/account'));
router.use('/api', passport.authenticate('jwt'), require('./controllers/mylist'));
router.use('/api', passport.authenticate('jwt'), require('./controllers/seen'));

module.exports = router;