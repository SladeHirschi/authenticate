const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { request } = require('express');
const cors = require('cors');
const session = require('express-session');
const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const model = require ('./model')

const app = express()



const port = process.env.PORT || 3001;

const Song = model.Song
const Playlist = model.Playlist
const User = model.User

app.use(express.urlencoded({extended: false}))
app.use(cors({credentials: true, origin: 'null'}))
app.use(express.static('public'))

// TODO: passport middleWares
app.use(session({ secret: 'asdfakl;wk;lfawjfwfwa', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session())


//PASSPORT Implementation Below

// 1. local strategy implementation
passport.use(new passportLocal.Strategy({
  usernameField: "email",
  passwordField: "plainPassword"

},  function (email, plainPassword, done) {
  //done is a function
  User.findOne({userEmail: email}).then(function (user) {
    //verify that the user exists
    if (!user) {
      //fail user deos not exist
      done(null, false)
      return;
    }
    user.verifyPassword(plainPassword, function (result) {
      if (result) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
  }).catch(function (err) {
    done(err)
  })

}));
  

// 2. serialize user to session
passport.serializeUser(function (user, done) {
  done(null, user._id);
})

// 3. deserialize user from session
passport.deserializeUser(function (userId, done) {
  User.findOne({_id: userId}).then(function (user) {
    done(null, user)
  }).catch(function (err) {
    done(err)
  })
})

// 4. Authenticate endpoint
app.post("/session", passport.authenticate("local"), function (req, res) {
  // this is the function for if authentication succeeds
  res.sendStatus(201);
})

// 5. "me", endpoint
app.get("/session", function (req, res) {
  if (req.user) {
    //send user details
    // res.sendStatus(200)
    res.json(req.user)

  } else {
    // send 401
    res.sendStatus(401)
  }
})

app.delete("/session", function (req, res){
  if(req.user) {
    console.log("User exists")
    req.logout();
    res.sendStatus(200)
  }
})






app.get('/songs', (req, res) => {
  Song.find().populate('playlist').then((songs) => {
    res.json(songs)
  })
})

app.get("/playlists/:playlistId/songs", (req, res) => {
  Song.find({playlist: req.params.playlistId}).then((songs) => {
    res.json(songs)
  })
})

app.get('/playlists', (req, res) => {
  Playlist.find().then((playlists) => {
    var filter = [];
    playlists.forEach(function(playlist) {
      if (playlist.user.equals(req.user._id )) {
        filter.push(playlist);
      }
      console.log("THis is the filter", filter)
    })

    console.log("Playlists queried from DB ny UserId", playlists)
    res.json(filter)
  })
})

app.post('/songs', (req, res) => {
  console.log("This is a post")
  // if (!req.user) {
  //   console.log("Was not true")
  //   return;
  // }
  console.log("Was true")
  var song = new Song({ 
    name: req.body.songName,
    length: req.body.songLength,
    rating: req.body.songRating,
    playlist: req.body.playlistId
  });
  song.save().then(() => {
    console.log(song)
    res.sendStatus(201)
  });
})

app.post('/playlists', (req, res) => {
  console.log("This is a post to playlists")
  var playlist = new Playlist({ 
    name: req.body.playlistName,
    user: req.body.userId
  });
  playlist.save().then(() => {
    console.log(playlist)
    res.sendStatus(201)
  });
})

app.post('/users', (req, res) => {
  console.log("Password to hash", req.body.userPlainPassword)
  var user = new User({ 
    userEmail: req.body.userEmail,
    userFirstName: req.body.userFirstName,
    userLastName: req.body.userLastName,
  });
  console.log("Password to hash", req.body.userPlainPassword)
  bcrypt.hash(req.body.userPlainPassword, 12).then(function(hash) {
    // Store hash in your password DB.
    console.log(req.body.userPlainPassword);
    console.log(hash)
    user.userEncryptedPassword = hash;
    user.save().then(() => {
      console.log(user)
      res.sendStatus(201)
    }).catch(function (err) {
      if (err.errors) {
        var messages = {}
        for (var e in err.errors) {
          messages[e] = err.errors[e].message
        }
      } else if (err.code == 11000) {
        res.status(422).json({
          email: "Already Registered"
        })
      }else {
        res.sendStatus(500)
        console.log("Unknown Error", err)
      }
    });
  });
})

app.delete('/songs/:songId', (req, res) => {
  Song.deleteOne({_id: req.params.songId}).then((song) => {
    // if (song.user.equals(req.user._id)) {


    //   // song.save().then(() => {
    //     res.sendStatus(200)
    //   // })
    // }
  })
})

app.put('/songs/:songId', (req, res) => {
  console.log("In put")
  Song.findOne({_id: req.params.songId}).then((song) => {
    // res.set("Access-Control-Allow-Origin", "*")
    console.log("THis is the song", song)
    if (song) {
      console.log("In put")


      song.name = req.body.songName,
      song.length = req.body.songLength,
      song.rating = req.body.songRating

      song.save().then(() => {
        console.log(song)
        // res.set("Access-Control-Allow-Origin", "*")
        res.sendStatus(200)
      }).catch((err) => {
        res.sendStatus(500)
      })
    } else {
      res.sendStatus(404)
    }
  }).catch((err) => {
    res.sendStatus(400)
  })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

// Password for DataBase access: YpAGKG0TMQhG5cy1

//Heroku Password SwH310490.

// https://secure-everglades-53753.herokuapp.com




