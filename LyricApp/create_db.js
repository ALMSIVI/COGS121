const dbname = 'Transracer.db';
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(dbname);

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE songs_to_lyrics (song TEXT, original TEXT, translated TEXT)");

  // insert 3 rows of data:
  db.run("INSERT INTO songs_to_lyrics VALUES ('fakesong', 'fakelyric', 'fakelyrict')");
  db.run("INSERT INTO songs_to_lyrics VALUES ('fakeSong2', 'fakelyric2', 'fakelyric2t')");

  console.log('successfully created the songs_to_lyrics table in ' + dbname);

  // print them out to confirm their contents:
  db.each("SELECT song, original, translated FROM songs_to_lyrics", (err, row) => {
      console.log(row.song + ": " + row.original + ' - ' + row.translated);
  });
});

db.close();
