$(() => {
  $('#readLyrics').click(() => {
    $.ajax({
      url: "addSong",
      type: "POST",
      dataType: 'json',
      data: {
        song: $('#newSong').val(),
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
  });
});