const   passport =  require('passport'),
        express =   require('express'),
        jwt =       require('jsonwebtoken'),
        keys =      require(__dirname+'../../../../config/keys');

const router = express.Router();

const createToken = (user, local) => {
    return jwt.sign({id: user._id, mail:user.email,local},keys.jwtKey, { expiresIn: '6h' })
}

router.route('/auth/42') //42 Auth
    .get(passport.authenticate('42'));

router.route('/auth/42/callback')
    .get(passport.authenticate('42', {failureRedirect: '/'}), (req, res) => {
        res.redirect(`/token/${createToken(req.user, false)}`);
    })
    
router.route('/auth/google') //Google Auth
    .get(passport.authenticate('google', {scope:['profile', 'email']}));

router.route('/auth/google/callback')
    .get(passport.authenticate('google', {failureRedirect: '/' }), (req, res) => {
        res.redirect(`/token/${createToken(req.user, false)}`);
    })

router.route('/auth/facebook') //Facebbok Auth
    .get(passport.authenticate('facebook', {scope : ['email']}));

router.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook', {failureRedirect: '/'}), (req, res) => {
        res.redirect(`/token/${createToken(req.user, false)}`);
    })

router.route('/auth/github') // Github Auth
    .get(passport.authenticate('github'));

router.route('/auth/github/callback')
    .get(passport.authenticate('github', {failureRedirect: '/' }), (req, res) => {
        res.redirect(`/token/${createToken(req.user, false)}`);
    })

router.post('/auth/login', function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(200).json({
                status:false,
                message: info ? info.message : 'Login failed',
                user   : user,
                code: 'NOTFOUND',
            });
        }

        req.login(user, (err) => {
            if (err) {
                res.send(err);
            }
            return res.json({
                status:true,
                token: createToken(user,true),
                });
        });
    })(req, res);
});

router.route('/auth/logout') 
.get((req, res) => { //Passport logout
    req.logout();
    res.redirect('/');
});

module.exports = router;