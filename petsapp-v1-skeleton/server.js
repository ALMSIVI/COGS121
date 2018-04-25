const express = require('express')
var bodyParser = require('body-parser')
const app = express();
app.use(express.static('static_files'));
app.use(express.bodyParser());

const songDatabase = {
  'fakeSong': {original: 'a', tranlated: 'ah'},
  'fakeSong2': {original: 'b', translated: 'bee'}
};





app.get('/songs', (req, res) => {

  const allSongtitles = Object.keys(songDatabase);
  //console.log('songs are:', songDatabase);
  res.send(allSongtitles);
});

app.get('/songs/:songname', (req, res) => {
  const nameToLookup = req.params.songname;

  const allSongtitles = Object.keys(songDatabase);
  res.send(allSongtitles);
})

app.post('/songs/:songname', (req, res) => {
  const name = req.params.songname;
  songDatabase[name] = {original: req.body};
  //song.original = req.body;
  console.log(req.body);
})
app.listen(3000, () => {
  console.log('server started at http://localhost:3000/');
});
