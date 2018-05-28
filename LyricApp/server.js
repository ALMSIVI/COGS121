// Express
const express = require('express');
const app = express();
app.use(express.static('static_files'));

app.listen(3000, () => {
  console.log('server started at http://localhost:3000/');
});

// Database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('Transracer.db');

// Body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Google translate
const translate = require('google-translate-api');

// GET requests
app.get('/songs', (req, res) => {
  db.all('SELECT title FROM songs_to_lyrics', (err, rows) => {
    console.log(rows);
    const allSongs = rows.map(e => e.title);
    console.log(allSongs);
    res.send(allSongs);
  });
  //const allSongtitles = Object.keys(songDatabase);
  //console.log('songs are:', songDatabase);
  //res.send(allSongtitles);
});

app.get('/songs/:title/:artist', (req, res) => {
  const nameToLookup = req.params.title;
  const artistToLookup = req.params.artist;
  console.log("Request name:", nameToLookup);
  console.log("Request artist:", artistToLookup);
  db.all(
    'SELECT * FROM songs_to_lyrics WHERE title=$song AND artist=$artist',
    {
      $song: nameToLookup,
      $artist: artistToLookup
    },
    (err, rows) => {
       //console.log(rows);
       if (rows.length > 0) {
         res.send(rows[0]);
       } else {
         res.send({});
       }
    }
  );
});


app.get('/', (req, res) => {
  res.redirect('/LyricApp.html');
});

/** API reference: https://www.npmjs.com/package/google-translate-api */
app.get('/words/:lang/:word', (req, res) => { //switched lang with word
  translate(req.params.word,
    {
      from: req.params.lang ? req.params.lang : 'auto',
      to: 'en'
  }).then((response) => {
    res.send({
      translated: response.text
    });
  }).catch((err) => {
    console.error(err);
    res.send({});
  });
});


// POST requests
app.post('/addSong/', (req, res) => {
  db.run(
    'INSERT INTO songs_to_lyrics VALUES ($title, $artist, $language, $oLyric, $tLyric)',
    {
      $title: req.body.title,
      $artist:req.body.artist,
      $language: req.body.language,
      $oLyric: req.body.oLyric,
      $tLyric: req.body.tLyric
    },
    (err) => {
      if(err) {
        console.log('error in POST');
        res.send({message: 'error in app.post(/songs/)'});
      } else {
        console.log('POST successful');
        res.send({message: 'successfully run app.post(/song/)'});
      }
    }
  );
});


// GET for login form
app.get('/accounts/:username/:password', (req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  console.log("Request username:", username);
  console.log("Request password:", password);
  db.all(
    'SELECT * FROM account WHERE username=$username AND password=$password',
    {
      $username: username,
      $password: password
    },
    (err, rows) => {
       console.log(rows);
       if (rows.length > 0) {
         res.send(rows[0]);
       } else {
         res.send({});
       }
    }
  );
});

// POST for create a new account
app.post('/createAccount/', (req, res) => {
  db.run(
    'INSERT INTO account VALUES ($username, $password)',
    {
      $username: req.body.username,
      $password: req.body.password,
    },
    (err) => {
      if(err) {
        console.log('error in POST');
        res.send({message: 'ERROR: Username already in use'});
      } else {
        console.log('POST successful');
        res.send({message: 'Account for \'' + req.body.username + '\' successfully created'});
      }
    }
  );
});
