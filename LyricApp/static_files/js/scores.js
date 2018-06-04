$(() => {
  // Graphing
  const graphScore = (data, id, title, type) => {
    const trace = setTrace(data[0], data[1], 'rgb(55, 128, 191)', type);

    data = [trace];
    const layout = {
      title: title,
      xaxis: {
        title: 'Date'
      },
      yaxis: {
        title: 'Score'
      }
    };

    Plotly.newPlot("scores-graph-" + id, data, layout);
  };

  const setTrace = (x, y, color, type) => {
    return {
      x: x,
      y: y,
      type: type, /* 'scatter', 'bar' */
      line: {
        color: color
      }
    };
  };

  const clearGraphs = () => {
    $('#scores-graph-user').empty();
    $('#scores-graph-avg').empty();
    $('#scores-description').empty();
    $('#score-stats').empty();
  };

  let data = [];
  let user = '';

  if (!sessionStorage.username || sessionStorage.username === '') {
    $('#scores').html('<p>No user currently logged in. Please <a href="#login">Login</a>.</p>');
  } else {
    user = sessionStorage.username;
    $('#scores-name').html('<p>Logged in as: ' + user + '.</p>');
  }

  // Showing top songs
  $.ajax({
    url: '/topSongs',
    type: 'GET',
    datatype: 'json',
    success: (data) => {
      data.songs.forEach((e) => {
        $('#song-list').append('<li><a href="/" class="scoreSong">' + e.artist + ' - ' + e.title + '</a></li><br>');
      });
    }
  });

  // Search
  $('#scoreform').submit((e) => {
    e.preventDefault();
    clearGraphs();
    if (validateWeak('#scoreform', '#searchResult')) {
      const title = $('#scoreform input[name=title]').val();
      const artist = $('#scoreform input[name=artist]').val();
      $.ajax({
        url: '/search',
        type: 'POST',
        datatype: 'json',
        data: {
          title: title,
          artist: artist
        },
        success: (data) => {
          clearGraphs();
          $('#searchResult').empty();
          if (!data.status) {
            $('#searchResult').html(data.message);
          } else if (data.unique) {
            graphUserScores(title, artist);
            graphAverageUserScores(title, artist);
          } else {
            $('#searchResult').html('<h3>Search Results:</h3><ul id=song-list></ul>');
            data.songs.forEach((e) => {
              $('#song-list').append('<li><a href="/" class="scoreSong">' + e.artist + ' - ' + e.title + '</a></li><br>');
            });
          }
        }
      });
    }
  });

  $(document).on('click', '.scoreSong', (e) => {
    e.preventDefault();
    const songId = $(event.target).text();
    const splitted = songId.split(' - ');
    graphUserScores(splitted[1], splitted[0]);
    graphAverageUserScores(splitted[1], splitted[0]);
  });

  const graphUserScores = (title, artist) => {
    $.ajax({
      url: 'showScore',
      type: 'POST',
      dataType: 'json',
      data: {
        username: user,
        title: title,
        artist: artist
      },
      success: (data) => {
        /* band-aid because the server should send an error code, not the client-side handling it */
        if (!data.scores) {
          $('#scores-graph-user').html('<p>You have not played this song before.</p>');
        } else {
          data = data.scores;

          // Stats
          const highest = data.reduce((acc, cur) => acc.score > cur.score ? acc : cur);
          $('#score-stats').append('<p>Your highest score is ' + highest.score + ', achieved on ' + highest.date + '.</p>');

          /* We need this to calculate average, so move this statement here */
          const yData = data.map(e => e.score);
          const avg = yData.reduce((acc, cur) => acc + cur) / yData.length;
          $('#score-stats').append('<p>Your average score is ' + avg + '.</p>');

          // Graph
          const xData = data.map(e => e.date);
          $('#scores-description').html('<p>Showing scores over time for: ' + title + ', by ' + artist + '.</p>');
          graphScore([xData, yData], 'user', 'Your Scores', 'scatter')
        }
      }
    });
  };
    
  const graphAverageUserScores = (title, artist) => {
    $.ajax({
      url: 'average/' + title + '/' + artist,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        /* band-aid because the server should send an error code, not the client-side handling it */
        if (!data.scores) {
          $('#scores-graph-avg').html('<p>No user played this song before.</p>');
        } else {
          data = data.scores;
          const xData = data.map(e => e.date);
          const yData = data.map(e => e.score);

          $('#scores-description').html('<p>Showing scores over time for: ' + title + ', by ' + artist + '.</p>');
          graphScore([xData, yData], 'avg', 'Average of User Scores', 'scatter')
        }
      }
    });
  };
});