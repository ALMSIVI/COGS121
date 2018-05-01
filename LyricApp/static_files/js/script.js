$(document).ready(() => {
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
        console.log(data.original);
        $('#originalarea').html('Original: \n' + '<pre>' + data.original + '</pre>');
        $('#translatedarea').html('Translated: \n' + '<pre>' + data.translated + '</pre>');
      }
    })
  })
  
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