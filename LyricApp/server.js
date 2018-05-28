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
        db.run('UPDATE songs_to_lyrics SET score=$newscore WHERE artist=$artist AND title=$title',
          {
            $newscore: rows[0].score + 1,
            $artist: rows[0].artist,
            $title: rows[0].title
          });
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

app.get('/topSongs', (req, res) => {
  db.all(
    'SELECT * FROM songs_to_lyrics ORDER BY score DESC',
    (err, rows) => {
      console.log(rows);
      const songs = rows.map((e) => {
        const song = {
          title: e.title,
          artist: e.artist
        };
        return song;
      });

      const list = { songs: songs };
      res.send(list);
    }
  );
});

// POST requests
app.post('/addSong/', (req, res) => {
  // TODO: implement song lyric update
  /*
  db.all('SELECT * FROM songs_to_lyrics WHERE title=$song AND artist=$artist',
  {
    $song: req.body.title,
    $artist: req.body.artist
  },
  (err, rows) => {
    if (rows.length > 0) {
      db.run('UPDATE songs_to_lyrics SET ')
    }
  });
  */
  db.run(
    'INSERT INTO songs_to_lyrics VALUES ($title, $artist, $language, $oLyric, $tLyric, 0)',
    {
      $title: req.body.title,
      $artist: req.body.artist,
      $language: req.body.language,
      $oLyric: req.body.oLyric,
      $tLyric: req.body.tLyric
    },
    (err) => {
      if (err) {
        console.log('error in POST');
        res.send({ message: 'error in app.post(/songs/)' });
      } else {
        console.log('POST successful');
        res.send({ message: 'successfully run app.post(/song/)' });
      }
    }
  );
});


// verify account informations
app.post('/accounts/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
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

// create a new account
app.post('/createAccount/', (req, res) => {
  db.run(
    'INSERT INTO account VALUES ($username, $password)',
    {
      $username: req.body.username,
      $password: req.body.password
    },
    (err) => {
      if (err) {
        console.log('error in POST');
        res.send({ message: 'ERROR: Username already in use' });
      } else {
        console.log('POST successful');
        res.send({ message: 'Account for \'' + req.body.username + '\' successfully created' });
      }
    }
  );
});

// Update score.
const moment = require('moment');
app.post('/addScore', (req, res) => {
  const username = req.body.username;
  const score = req.body.score;
  const title = req.body.title;
  const artist = req.body.artist;
  const date = moment().format('YYYY-MM-DD');
  console.log('date', date);
  db.all(
    'SELECT * FROM score WHERE username=$username AND title=$title AND artist=$artist AND date=$date',
    {
      $username: username,
      $title: title,
      $artist: artist,
      $date: date
    },
    (err, rows) => {
      if (rows.length > 0) {
        if (rows[0].score < score) { // update
          db.run(
            'UPDATE score SET score=$score WHERE username=$username AND title=$title AND artist=$artist AND date=$date',
            {
              $username: username,
              $score: score,
              $title: title,
              $artist: artist,
              $date: date
            },
            (err) => {
              if (err) {
                console.log('error in POST', err);
                res.send({ message: 'error in app.post(/addScore/)' });
              } else {
                console.log('POST successful');
                res.send({ message: 'successfully run app.post(/addScore/)' });
              }
            }
          );
        }
      } else { // insert
        db.run(
          'INSERT INTO score VALUES ($username, $score, $title, $artist AND date=$date)',
          {
            $username: username,
            $score: score,
            $title: title,
            $artist: artist,
            $date: date
          },
          (err) => {
            if (err) {
              console.log('error in POST', err);
              res.send({ message: 'error in app.post(/addScore/)' });
            } else {
              console.log('POST successful');
              res.send({ message: 'successfully run app.post(/addScore/)' });
            }
          }
        );
      }
    });
  
});

app.post('/showScore', (req, res) => {
  const username = req.body.username;
  const title = req.body.title;
  const artist = req.body.artist;

  db.all(
    'SELECT * FROM score WHERE username=$username AND title=$title AND artist=$artist ORDERBY date',
    {
      $username: username,
      $title: title,
      $artist: artist
    },
    (err, rows) => {
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        console.log('Error in POST /showScore');
        res.send({});
      }
    }
  );
});
