$(() => {
  $('#readLyrics').click(() => {
    let validated = true;
    if (!$('#newSong').val()) {
      alert('Please enter song title!');
      validated = false;
    }
    if (!$('#newArtist').val()) {
      alert('Please enter artist!');
      validated = false;
    }
    if (!$('#lyrics').val()) {
      alert('Please enter lyrics!');
      validated = false;
    }
    if (!$('#translatedLyrics').val()) {
      alert('Please enter translated lyrics!');
      validated = false;
    }

    if (validated) {
      $('#addStatus').html($('#newSong').val() + ' was successfully added');
      $.ajax({
        url: "addSong",
        type: "POST",
        dataType: 'json',
        data: {
          title: $('#newSong').val(),
          artist: $('#newArtist').val(),
          language: $('#newLanguage').val(),
          oLyric: $('#lyrics').val(),
          tLyric: $('#translatedLyrics').val(),
        },
        success: (data) => {
          console.log($('#newSong').val() + 'was successfully added.');
          //status later
        }

      });
    }
  });
});
