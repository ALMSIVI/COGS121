$(document).ready(() => {
  let nextLine = "";
  let translatedLyrics = "";
  let lineCounter = 0;
  let originalLyrics = "";
  $('#readLyrics').click(() => {
    const requestURL = 'songs/' + $('#newSong').val();
    const tlyricURL = 'songs/' + $('#newSong').val(); + '/tlyric'
    const originalLyric = $('#lyrics').val();
    const translatedLyric = $('#translatedlyrics').val();
    //console.log('read button clicked!');
    console.log(originalLyric);
    $.ajax({
      url: requestURL,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        //console.log(data);

        if(data.original) {
          $('#status').html('Song already exists at URL: ' + requestURL);
          //$('#jobDiv').html('My job is ' + data.job);
          //$('#petImage').attr('src', data.pet);
        } else {
          $('#status').html('Error: could not find user at URL: ' + requestURL);
        }
      }
    });

    $.ajax({
      url: requestURL,
      type: "POST",
      dataType: 'json',
      data: {
                'original': originalLyric,
                'translated': translatedLyric
            },
      success: (data) => {
        //status later
      }
    });
  });

  $('#songSelection').click(() => {
    const songName = $('#songname').val();
    const songSelectURL = 'select/' + songName
    $.ajax({
      url: songSelectURL,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        nextLine = data.translated.split('\n')[0];
        correctLine = data.original.split('\n')[0];
        correctLine = correctLine.replace(/\s+/g,' ').trim();
        translatedLyrics = data.translated;
        originalLyrics = data.original;
        $('#originalarea').html('Original: \n' + '<pre>' + nextLine + '</pre>');
        $('#translatedarea').html('Translated: \n' + '<pre>' + data.translated + '</pre>');
      }
    })
  })
//test
  $("#lineInput").keyup(function(event) {
    if (event.keyCode === 13) {
      $("#checkIfCorrect").click();
    }
  });

  $("#checkIfCorrect").click(function() {
    if (correctLine.toUpperCase() == $('#lineInput').val().toUpperCase()){
      lineCounter++;

      getNextLine();
      $('#originalarea').html('Original: \n' + '<pre>' + nextLine + '</pre>');
    }
    else { alert("doesn't work");
      console.log("correctLine= " + correctLine);
      console.log($('#lineInput').val());
    }
  });

  const getNextLine = () => {
    nextLine = translatedLyrics.split('\n')[lineCounter];
    while ( $.trim(nextLine) == '' ) {
      lineCounter++;
      nextLine = translatedLyrics.split('\n')[lineCounter];
    }
    correctLine = originalLyrics.split('\n')[lineCounter];
    correctLine = correctLine.replace(/\s+/g,' ').trim();
  };
//test

  $('#readLyrics').click(() => {
    $.ajax({
      url: 'songs/',
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        //console.log(data);
        $('#status').html('All users: ' + data);
      }
    });
  });
});
