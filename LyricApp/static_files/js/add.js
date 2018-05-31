$(() => {
  $('#addform').submit((e) => {
    e.preventDefault();
    if (validate('#addform', '#addStatus')) {
      $('#addStatus').html($('#newSong').val() + ' was successfully added');
      $.ajax({
        url: "addSong",
        type: "POST",
        dataType: 'json',
        data: {
          title: $('#addform input[name=title]').val(),
          artist: $('#addform input[name=artist]').val(),
          language: $('#addform input[name=language]').val(),
          oLyric: $('#addform input[name=original-lyric]').val(),
          tLyric: $('#addform input[name=translated-lyric]').val(),
        },
        success: (data) => {
          $('#addStatus').html($('#addform input[name=artist]').val() + ' - ' + $('#addform input[name=title]').val() + 'was successfully added.');
        }
      });
    }
  });
});
