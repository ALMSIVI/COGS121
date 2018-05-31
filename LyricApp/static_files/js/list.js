'use strict';

$(() => {
  $.ajax({
    url: '/topSongs',
    type: 'GET',
    datatype: 'json',
    success: (data) => {
      data.songs.forEach((e) => {
        $('#song-list').append('<li><a href="/" class="listSong">' + e.artist + ' - ' + e.title + '</a></li><br>');
      });
    }
  });

  /** When the user submits, store the info into sessionStorage and jump to game page */
  $('#search').submit((e) => {
    e.preventDefault();
    const title = $('#search input[name=title]').val();
    const artist = $('#search input[name=artist]').val();
    if (validateWeak('#search', '#searchResult')) {
      $.ajax({
        url: '/search',
        type: 'POST',
        datatype: 'json',
        data: {
          title: title,
          artist: artist
        },
        success: (data) => {
          $('#searchResult').html('');
          if (!data.status) {
            $('#searchResult').html(data.message);
          } else if (data.unique) {
            sessionStorage.setItem('artist', artist);
            sessionStorage.setItem('title', title);
            window.location.href = 'LyricApp.html#game';
          } else {
            $('#searchResult').html('<h3>Search Results:</h3><ul id=song-list></ul>');
            data.songs.forEach((e) => {
              $('#song-list').append('<li><a href="/" class="listSong">' + e.artist + ' - ' + e.title + '</a></li><br>');
            });
          }
        }
      });
    }
  });

    /** When the user clicks on a song, store the info into sessionStorage and jump to game page */
    $(document).on('click', '.listSong', (e) => {
      e.preventDefault();
      const songId = $(event.target).text();
      const splitted = songId.split(' - ');
      sessionStorage.setItem('artist', splitted[0]);
      sessionStorage.setItem('title', splitted[1]);
      window.location.href = 'LyricApp.html#game';
    });
});