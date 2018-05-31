$(() => {
  const graphScore = (data, id, title, type) => {
    const trace = setTrace(data[0], data[1], 'rgb(55, 128, 191)', type);

    data = [trace];
    const layout = {
      title: title,
      xaxis: {
        title: 'x'
      },
      yaxis: {
        title: 'y'
      }
    };

    Plotly.newPlot("scores-" + id, data, layout);
  }

  const setTrace = (x, y, color, type) => {
    return {
      x: x,
      y: y,
      type: type, /* 'scatter', 'bar' */
      line: {
        color: color
      }
    };
  }

  let data = [];
  let user = '';

  if (!sessionStorage.username || sessionStorage.username === '') {
    $('#scores').html('<p>No user currently logged in. Please <a href="#login">Login</a>.</p>');
  }
  else {
    user = sessionStorage.username;
    $('#scores-name').html('<p>Logged in as: ' + user + '.</p>');
  }

  // Validation
  $('#result-list').append('<li>WARNING: FUNCTIONALITY NOT COMPLETE. NO VALIDATION FOR EMPTY INPUTS.</li>');
  $('#scoreform').submit((e) => {
    e.preventDefault();
    const title = $('#scoreform input[name=title]').val();
    const artist = $('#scoreform input[name=artist]').val();
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
          $('#scores-graph').html('<p>No scores found for that song.</p>');
        } else {
          data = data.scores;
          let xData = [];
          let yData = [];

          for (let i = 0; i < data.length; ++i) {
            xData.push(data[i].date);
            yData.push(data[i].score);
          }

          $('#scores-graph').empty();
          $('#scores-description').html('<p>Showing scores over time for: ' + title + ', by ' + artist + '.</p>');
          graphScore([xData, yData], 'graph', 'Scores ', 'scatter')
        }
      }
    });
  });
});