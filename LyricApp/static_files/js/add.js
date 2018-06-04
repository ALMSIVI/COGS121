$(() => {
  $('#addform').submit((e) => {
    e.preventDefault();
    if (validate('#addform', '#addStatus')) {
      $.ajax({
        url: "addSong",
        type: "POST",
        dataType: 'json',
        data: {
          title: $('#addform input[name=title]').val(),
          artist: $('#addform input[name=artist]').val(),
          language: $('#addform input[name=language]').val(),
          oLyric: $('#addform textarea[name=original-lyrics]').val(),
          tLyric: $('#addform textarea[name=translated-lyrics]').val(),
        },
        success: (data) => {
          if (!data.status) {
            $('#addStatus').html(data.message);
          } else if (data.insert) {
            $('#addStatus').html($('#addform input[name=artist]').val() + ' - ' + $('#addform input[name=title]').val() + ' was successfully added.');
          } else {
            $('#addStatus').html($('#addform input[name=artist]').val() + ' - ' + $('#addform input[name=title]').val() + ' was successfully updated.');
          }
        }
      });
    }
  });
});
