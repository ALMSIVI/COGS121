$(() => {
  let nextLine = "";
  let translatedLyrics = "";
  let lineCounter = 0;
  let originalLyrics = "";
  let complete = 'Not Complete';
  let finalScore = 100;
  var hintUrl = 'words/';

  $('#songSelection').click(() => {
    const songName = $('#songTitle').val();
    const songArtist = $('#songArtist').val();
    const songSelectURL = 'songs/' + songName + '/' + songArtist;

    $.ajax({
      url: songSelectURL,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        /* band-aid because the server should send an error code, not the client-side handling it */
        if (!data.tLyric) {
          $('#error').html("<p>Song/Artist pair not found in the database.</p>");
          $('#error').css('display', 'block');
        }
        else {
          $('#error').css('display', 'none');
          $('#transrace').css('display', 'block');
          $('#hint').html("");
          finalScore = 100;
          complete = 'Not Complete';
          nextLine = data.tLyric.split('\n')[0];
          correctLine = data.oLyric.split('\n')[0];
          correctLine = correctLine.replace(/\s+/g, ' ').trim();
          translatedLyrics = data.tLyric;
          originalLyrics = data.oLyric;
          hintUrl += data.language + '/';
          $('#originalarea').html('<p>Translated Lyrics: \n' + '<pre>' + nextLine + '</pre></p>');

          //$('#translatedarea').html('Translated: \n' + '<pre>' + data.translated + '</pre>');
        }
      }
    })
  })
  $("#lineInput").keyup(function (event) {//Enter Key
    if (event.keyCode === 13) {
      $("#checkIfCorrect").click();
    }
  });

  $("#lineInput").keyup(function (event) {//Control Key
    if (event.keyCode === 17) {
      const input = $('#lineInput').val().toUpperCase();
      const correct = correctLine.toUpperCase();
      const wordCheck = findWrong(input, correct);
      $('#hint').html(wordCheck);
    }
  });


  $("#checkIfCorrect").click(function () {
    const input = $('#lineInput').val().toUpperCase();
    const correct = correctLine.toUpperCase();
    if (correct == input) {
      //lineCounter++;
      finalScore += 20;
      getNextLine();
      if(complete == 'Not Complete'){
      $('#originalarea').html('Original: \n' + '<pre>' + nextLine + '</pre>');
      $('#lineInput').val('');
      $('#hint').html("");
    }
    else{
      $('#originalarea').html('Song is Complete!');
      $('#lineInput').val('');
      $('#hint').html("Final Score" + finalScore);
    }
    }
    else {
      finalScore -= 10;
      const wrongWord = findWrong(input, correct);

      //console.log("correctLine= " + correctLine);
      //console.log($('#lineInput').val());
      $('#hint').html(wrongWord);
    }
  });


  $("#lineInput").keyup(function (event) {//Shift Key
    if (event.keyCode === 16) {
      getHint();
    }
  });

  /*function highlight(text) {
  var inputText = document.getElementById("inputText");
  var innerHTML = inputText.innerHTML;
  var index = innerHTML.indexOf(text);
  if (index >= 0) {
   innerHTML = innerHTML.substring(0,index) + "<span class='highlight'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
   inputText.innerHTML = innerHTML;
  }
}*/
  function getNextLine() {
    lineCounter++;
    if(translatedLyrics.split('\n').length > lineCounter) {
    nextLine = translatedLyrics.split('\n')[lineCounter];
    while ($.trim(nextLine) == '') {
      lineCounter++;
      nextLine = translatedLyrics.split('\n')[lineCounter];
    }
    correctLine = originalLyrics.split('\n')[lineCounter];
    correctLine = correctLine.replace(/\s+/g, ' ').trim();
  }
  else {
    complete = 'Complete';
  }
  }

  function findWrong(input, correct) {//input = input line all caps, correct = correctline
    input = input.trim();
    var inputArray = input.split(" ");

    var correctArray = correct.split(" ");
    var counter = 0;
    var response = '';
    var limit = inputArray.length - 1;
    while (limit != counter && inputArray[counter] == correctArray[counter]) {
      counter++;
    }
    if (inputArray[counter] == correctArray[counter]) {
      response = "All Correct so Far!";
      return response;
    }
    else {
      response = "Wrong word: " + inputArray[counter];
      return response;
    }


  }
  function getHint() {
    //test
    finalScore -= 3;
    var inputArray = $('#lineInput').val().split(" ");
    var hints = correctLine.split(" ");
    var hintWord = hints[inputArray.length - 1];//
    var hintTrans = 'didnt work';
    var hintUrlWord = hintUrl + hintWord; //made this way to reuse hintUrl;
    console.log(hintUrl);
    $.ajax({
      url: hintUrlWord,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
          $('#hint').html("hint: " + data.translated);
      console.log(data);
      }
    })

    //return hints[inputArray.length - 1];
  }


  /*$('#readLyrics').click(() => {
    $.ajax({
      url: 'songs/',
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        //console.log(data);
        $('#status').html('All users: ' + data);
      }
    });
  });*/
});
