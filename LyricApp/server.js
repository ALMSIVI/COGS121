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

// GET requests
/** Redirects the user to the home page. */
app.get('/', (req, res) => {
  res.redirect('/LyricApp.html');
});

/** Get the exact song with the title and artist. */
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

/** Get the average score of the song ordered by date. */
app.get('/average/:title/:artist', (req, res) => {
  const nameToLookup = req.params.title;
  const artistToLookup = req.params.artist;
  console.log("Request name:", nameToLookup);
  console.log("Request artist:", artistToLookup);
  db.all(
    'SELECT AVG(score) as "score", date FROM score WHERE title=$song AND artist=$artist GROUP BY date',
    {
      $song: nameToLookup,
      $artist: artistToLookup
    },
    (err, rows) => {
      if (rows.length > 0) {
        console.log('GET /average: score found for song ' + artistToLookup + ' - ' + nameToLookup);
        res.send({scores: rows});
      } else {
        console.log('GET /average: No score found for any user for song ' + artistToLookup + ' - ' + nameToLookup);
        res.send({});
      }
    }
  );
});

/** Translates a word from another language into English.
 * API reference: https://www.npmjs.com/package/google-translate-api */
const translate = require('google-translate-api');
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

/** Get a list of songs with the top search score. */
app.get('/topSongs', (req, res) => {
  db.all(
    'SELECT * FROM songs_to_lyrics ORDER BY score DESC',
    (err, rows) => {
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
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/** Adds a song to the library; updates the lyric base if the song exists. */
app.post('/addSong/', (req, res) => {
  db.all('SELECT * FROM songs_to_lyrics WHERE title=$song AND artist=$artist AND language=$language',
    {
      $song: req.body.title,
      $artist: req.body.artist,
      $language: req.body.language
    },
    (err, rows) => {
      if (rows.length > 0) { // update
        db.run('UPDATE songs_to_lyrics SET oLyric=$oLyric, tLyric=$tLyric WHERE title=$song AND artist=$artist AND language=$language', {
          $title: req.body.title,
          $artist: req.body.artist,
          $language: req.body.language,
          $oLyric: req.body.oLyric,
          $tLyric: req.body.tLyric
        },
          (err) => {
            if (err) {
              console.log('error in POST /addSong');
              res.send({ status: false, message: 'Error in app.post(/addSong)' });
            } else {
              console.log('POST successful');
              res.send({ status: true, insert: false});
            }
          });
      } else { // insert
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
              res.send({ status: false, message: 'Error in app.post(/addSong)' });
            } else {
              console.log('POST successful');
              res.send({ status: true, insert: true});
            }
          }
        );
      }
    }
  );
  
});


/** Login account verification. */
app.post('/accounts/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  db.all(
    'SELECT * FROM account WHERE username=$username AND password=$password',
    {
      $username: username,
      $password: password
    },
    (err, rows) => {
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.send({});
      }
    }
  );
});

/** Create a new account. */
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
        res.send({
          message: 'ERROR: Username already in use',
          status: false
        });
      } else {
        console.log('POST successful');
        res.send({
          message: 'Account for \'' + req.body.username + '\' successfully created',
          status: true
        });
      }
    }
  );
});

/** Update the user's game score. */
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
          'INSERT INTO score VALUES ($username, $score, $title, $artist, $date)',
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

/** Displays the user's score for a specific song. */
app.post('/showScore', (req, res) => {
  const username = req.body.username;
  const title = req.body.title;
  const artist = req.body.artist;

  db.all(
    'SELECT score, date FROM score WHERE username=$username AND title=$title AND artist=$artist ORDER BY date',
    {
      $username: username,
      $title: title,
      $artist: artist
    },
    (err, rows) => {
      if (rows.length > 0) {
        res.send({ scores: rows });
      } else {
        console.log('Song doesn\'t exist while POSTing /showScore'); // user tries to lookup a song that doesn't exist in the db, throws error
        res.send({});
      }
    }
  );
});

/** Searches for a song based on title OR artist. */
app.post('/search', (req, res) => {
  const title = req.body.title;
  const artist = req.body.artist;
  // Front-end validation guarantees that at least one is nonempty.
  if (title === '') {
    db.all('SELECT * FROM songs_to_lyrics WHERE artist=$artist',
      {
        $artist: artist
      },
      (err, rows) => {
        if (err) {
          res.send({ status: false, message: 'Error in /POST' });
        } else if (rows.length === 0) {
          res.send({ status: false, message: 'Artist ' + artist + ' not found.' });
        } else {
          res.send({ status: true, unique: false, songs: rows });
        }
      });
  } else if (artist === '') {
    db.all('SELECT * FROM songs_to_lyrics WHERE title=$title',
    {
      $title: title
    },
    (err, rows) => {
      if (err) {
        res.send({ status: false, message: 'Error in /POST' });
      } else if (rows.length === 0) {
        res.send({ status: false, message: 'Title ' + title + ' not found.' });
      } else {
        res.send({ status: true, unique: false, songs: rows });
      }
    });
  } else {
    db.all('SELECT * FROM songs_to_lyrics WHERE artist=$artist AND title=$title',
    {
      $artist: artist,
      $title: title
    },
    (err, rows) => {
      if (err) {
        res.send({ status: false, message: 'Error in /POST' });
      } else if (rows.length === 0) {
        res.send({ status: false, message: 'Song: ' + artist + ' - ' + title + ' not found.' });
      } else {
        res.send({ status: true, unique: true, songs: rows });
      }
    });
  }
});