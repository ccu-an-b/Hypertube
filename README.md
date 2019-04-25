
# Hypertube
Welcome to Hypertube, a streaming website that allows users to search and watch their favourite movies. All movies are download from a torrent, scraped from [YTS](https://yts.am/) and [PopcornTime](https://popcorntime.sh/fr/), and then directly streamed on the website.

![alt text](Client/public/preview_readme.png?raw=true "Title")

### Build with
* [NodeJS](https://nodejs.org/en/) - Backend
* [Express](https://expressjs.com/) - Web application framework
* [ReactJS](https://reactjs.org/) - Frontend
* [MongoDb](https://www.mongodb.com/) - Database
* [Mongoose](https://mongoosejs.com/) -  Mongodb object modeling

## Get the requirement

### Prerequisites
You need to have installed [NodeJS](https://nodejs.org/en/) and [MongoDb](https://www.mongodb.com/). Here a MongoDb Atlas was used link to the project with a connecting string.

*API/server.js*
```
mongoose.connect(`mongodb+srv://${config.mongo.user}:${config.mongo.password}@${config.mongo.cluster}.mongodb.net/${config.mongo.database}`)
```

### Modify the config files
*API/config/congif.js* 
```
module.exports = {
    mongo: {
      password: 'YourMongoPassword',
      user: 'YourMongoUsername',
      cluster: 'yourClusterName',
      database: 'yourDatabaseName'
    }
  }
```

*API/config/keys.js*
```
module.exports = {
    googleClientID : 'yourGoogleClientID',
    goggleClientSecret : 'yourGoggleClientSecret',
    facebookClientID: 'yourFacebookClientID',
    facebookClientSecret: 'yourFacebookClientSecret',
    fortyTwoClientID: 'yourFortyTwoClientID',
    fortyTwoClientSecret: 'yourFortyTwoClientSecret',
    githubClientID : 'yourGithubClientID',
    githubClientSecret: 'yourGithubClientSecret',
    cookieKey: 'yourCookieKey',
    moviedbKey: 'yourMoviedbKey',
    jwtKey: 'yourJwtKey',
};
```
## Let's start

### Make sure all your node modules are installed
```
npm i
npm run installAll
```

### Add few movies to your database
```
npm run init
```

### Run your server
```
npm start
```

![alt text](Client/public/model_readme.png?raw=true "Title")

## API Documentation
Check the [Hypertube Postman Collection](https://documenter.getpostman.com/view/5179190/S1ENzKHx) to get all the API's endpoints.
