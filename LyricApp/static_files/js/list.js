'use strict';

$(() => {
  $.ajax({
    url: '/topSongs',
    type: 'GET',
    datatype: 'json',
    success: (data) => {
      data.songs.forEach((e) => {
        $('#songList').append('<li class="listSong">' + e.artist + ' - ' + e.title + '</li><br>');
      });
    }
  });
});