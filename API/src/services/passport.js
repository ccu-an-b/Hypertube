const   passport =          require('passport'),
        GoogleStrategy =    require('passport-google-oauth20').Strategy,
        LocalStrategy =     require('passport-local').Strategy,
        FacebookStrategy =  require('passport-facebook').Strategy,
        FortyTwoStrategy =  require('passport-42').Strategy,
        GitHubStrategy =    require('passport-github').Strategy,
        passportJWT =       require("passport-jwt"),
        bcrypt = require('bcrypt');

const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const keys = require(__dirname+'../../../config/keys');
const UserModel = require(__dirname+'../../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id)
        .then(user => done(null, user))
});

// OAuth: 42  
passport.use(new FortyTwoStrategy({
    clientID: keys.fortyTwoClientID,
    clientSecret: keys.fortyTwoClientSecret,
    callbackURL: '/auth/42/callback'
    }, 
    async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser =  await UserModel.findOne({ fortyTwoId: profile.id})

            if (existingUser){ 
                return done(null, existingUser);
            } 
            const user = await new UserModel({
                login: profile._json.login,
                firstname: profile._json.first_name,
                lastname: profile._json.last_name,
                email: profile._json.email,
                img: profile._json.image_url,
                fortyTwoId: profile._json.id,
            }).save()
            done(null, user);
        } catch (err) {
            return done(null, false);
        }
    }
));

// OAuth: Google
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.goggleClientSecret,
    callbackURL: '/auth/google/callback'
    }, 
    async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser =  await UserModel.findOne({ googleId: profile.id})
    
            if (existingUser){ 
                return done(null, existingUser);
            } 
            const user = await new UserModel({
                login: profile._json.email,
                firstname: profile._json.given_name,
                lastname: profile._json.family_name,
                email: profile._json.email,
                img: profile._json.picture,
                googleId: profile.id,
            }).save()
            done(null, user);
        } catch (err){
            return done(null, false);
        }
    }
));

// OAuth: Facebook 
passport.use(new FacebookStrategy({
    clientID:  keys.facebookClientID,
    clientSecret:  keys.facebookClientSecret,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'email', 'name', 'photos']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser =  await UserModel.findOne({ facebookId: profile.id})

        if (existingUser){ 
            return done(null, existingUser);
        } 
        const user = await new UserModel({
            login: profile._json.email,
            firstname: profile._json.first_name,
            lastname: profile._json.last_name,
            email: profile._json.email,
            img: profile.photos[0].value,
            facebookId: profile.id,
        }).save()
        done(null, user);
    } catch (err){
        return done(null, false);
    }
  }
));

// OAuth: Github
passport.use(new GitHubStrategy({
    clientID:  keys.githubClientID,
    clientSecret:  keys.githubClientSecret,
    callbackURL: "/auth/github/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser =  await UserModel.findOne({ githubId: profile.id})

        if (existingUser){ 
            return done(null, existingUser);
        } 
        const user = await new UserModel({
            login: profile._json.login,
            firstname: profile._json.name,
            lastname: profile._json.name,
            email: profile._json.email,
            img: profile._json.avatar_url,
            githubId: profile._json.id,
        }).save()
        done(null, user);
    } catch (err) {
        return done(null, false);
    }
  }
));

// Auth: Local
passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
}, 
function (login, password, cb) {
    return UserModel.findOne({login})
       .then(user => {
            if (!user) {
               return cb(null, false, {message: `${login} doesn't exist.`});
            }
            if (bcrypt.compareSync(password, user.password))
                return cb(null, user, {message: 'Logged In Successfully'});
            return cb(null, false, {message: `Wrong password`});
      })
      .catch(err => cb(err));
}
));

//JWT Check
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : keys.jwtKey
},
function (jwtPayload, cb) {
    return UserModel.findOne({_id: jwtPayload.id})
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));