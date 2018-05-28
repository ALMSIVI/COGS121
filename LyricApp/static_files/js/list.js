'use strict';

$(() => {
  $.ajax({
    url: '/topSongs',
    type: 'GET',
    datatype: 'json',
    success: (data) => {
      data.songs.forEach((e) => {
        $('#songList').append('<li><a href="/" class="listSong">' + e.artist + ' - ' + e.title + '</a></li><br>');
      });
    }
  });

  /** When the user clicks on a song, store the info into sessionStorage and jump to game page */
  $('#topSongs').on('click', '.listSong', (e) => {
    e.preventDefault();
    const songId = $(event.target).text();
    const splitted = songId.split(' - ');
    sessionStorage.setItem('artist', splitted[0]);
    sessionStorage.setItem('title', splitted[1]);
    window.location.href = 'LyricApp.html#game';
  });

  /** When the user submits, store the info into sessionStorage and jump to game page */
  $('#songSelection').click(() => {
    const title = $('#songTitle').val();
    const artist = $('#songArtist').val();
    if (!title || !artist) {
      alert('Please enter both the title and the artsit!');
    } else {
      sessionStorage.setItem('artist', title);
      sessionStorage.setItem('title', artist);
      window.location.href = 'LyricApp.html#game';
    }
  });
});