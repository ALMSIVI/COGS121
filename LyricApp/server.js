const express = require('express')
var bodyParser = require('body-parser')
const app = express();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('lyrics.db');

app.use(express.static('static_files'));
app.use(express.bodyParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*const songDatabase = {
  'fakeSong': {original: 'a', tranlated: 'ah'},
  'fakeSong2': {original: 'b', translated: 'bee'}
};*/





app.get('/songs', (req, res) => {
  db.all('SELECT song FROM songs_to_lyrics', (err, rows) => {
    console.log(rows);
    const allSongs = rows.map(e => e.song);
    console.log(allSongs);
    res.send(allSongs);
  });
  //const allSongtitles = Object.keys(songDatabase);
  //console.log('songs are:', songDatabase);
  //res.send(allSongtitles);
});

app.get('/songs/:songname', (req, res) => {
  const nameToLookup = req.params.songname;
  db.all(
    'SELECT * FROM songs_to_lyrics WHERE song=$song',
    {
      $song: nameToLookup
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

})

app.get('/select/:songname', (req, res) =>{
  const songToLookup = req.params.songname;
  db.all(
    'SELECT * FROM songs_to_lyrics WHERE song=$song',
    {
      $song: songToLookup
    },
    (err, rows) => {
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.send({});
      }
    }
  );

})
app.post('/songs/:songname', (req, res) => {
  const name = req.params.songname;
  db.run(
    'INSERT INTO songs_to_lyrics VALUES ($song, $original, $translated)',
    {
      $song: name,
      $original: req.body.original,
      $translated: req.body.original
    },
    (err) => {
      if(err) {
        res.send({message: 'error in app.post(/songs/:songname)'});
      } else {
        res.send({message: 'successfully run app.post(/song/:songname)'});
      }
    }

  );
  //songDatabase[name] = {original: req.body.original, translated: req.body.translated};
  //song.original = req.body;
  //console.log(songDatabase[name]);
});



app.listen(3000, () => {
  console.log('server started at http://localhost:3000/');
});
