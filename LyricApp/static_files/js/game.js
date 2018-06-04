$(() => {
  let nextLine = '';
  let translatedLyrics = '';
  let lineCounter = 0;
  let originalLyrics = '';
  let complete = 'Not Complete';
  let finalScore = 100;
  var hintUrl = 'words/';
  let hintCounter = 0;
  let inputLength = 0; // used for hint to see if user is still on the same word

  /** Check if the user comes from the find page; if so, render with sessionStorage */

  const songSelectURL = 'songs/' + sessionStorage.title + '/' + sessionStorage.artist;
  $.ajax({
    url: songSelectURL,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
        $('#transrace').css('display', 'block');
        $('#hint').empty();
        hintCounter = 0; // resetting all values if user selects new song
        finalScore = 100;
        complete = 'Not Complete';
        lineCounter = 0;
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
  );

  /** Handles different key inputs */
  $('#lineInput').keyup((event) => {
    switch (event.keyCode) {
      case 13:
        $('#checkIfCorrect').click(); // Enter key: finish one line, check for next
        break;
      case 17: // Control key
        const input = $('#lineInput').val().toUpperCase();
        const correct = correctLine.toUpperCase();
        const wordCheck = findWrong(input, correct);
        $('#hint').html(wordCheck);
        break;
      case 18: // Alt key
        $('#btnhint').click();
        break;
    }
  });

  /** Check if user input is correct. */
  $('#checkIfCorrect').click(() => {
    const correct = correctLine.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
    const input = $('#lineInput').val().toUpperCase();
    console.log(input);
    console.log(correct);
    if (correct === input) { // ignor case comparison
      // lineCounter++;
      finalScore += 20;
      getNextLine();
      if (complete === 'Not Complete') {
        $('#originalarea').html('Original: \n' + '<pre>' + nextLine + '</pre>');
        $('#lineInput').val('');
        $('#hint').empty();
      } else { // Song is completed
        $('#originalarea').html('Song is Complete!');
        $('#lineInput').val('');
        $('#hint').append('<p>Final Score: ' + finalScore + '</p>');
        if (sessionStorage.username && sessionStorage.username !== '') {
          $.ajax({
            url: 'addScore',
            type: 'POST',
            dataType: 'json',
            data: {
              username: sessionStorage.username,
              score: finalScore,
              title: sessionStorage.title,
              artist: sessionStorage.artist
            },
            success: (data) => {
              console.log(data.message);
            }
          });
          $('#hint').append('<p>Your score has been uploaded.</p>');
        } else {
          $('#hint').append('<p>Log in to have your score uploaded.</p>');
        }
      }
    } else {
      finalScore -= 10;
      const wrongWord = findWrong(input, correct);
      //console.log("correctLine= " + correctLine);
      //console.log($('#lineInput').val());
      $('#hint').html(wrongWord);
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
    if (translatedLyrics.split('\n').length > lineCounter) {
      nextLine = translatedLyrics.split('\n')[lineCounter];
      while ($.trim(nextLine) == '') {
        lineCounter++;
        nextLine = translatedLyrics.split('\n')[lineCounter];
      }
      correctLine = originalLyrics.split('\n')[lineCounter];
      correctLine = correctLine.replace(/\s+/g, ' ').trim();
    } else {
      complete = 'Complete';
    }
  }

  function findWrong(input, correct) { // input = input line all caps, correct = correctline
    input = input.trim();
    const inputArray = input.split(' ');
    const correctArray = correct.normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(' ');//filters diacritics
    let counter = 0;
    const limit = inputArray.length - 1;
    while (limit != counter && inputArray[counter] == correctArray[counter]) {
      counter++;
    }
    if (inputArray[counter] == correctArray[counter]) {
      return 'All Correct so Far!';
    } else {
      const userInput = inputArray[counter] === '' ? '(empty)' : inputArray[counter];
      return 'Wrong word: ' + userInput;
    }
  }

  $('#btnhint').click(() => {
    const inputArray = $('#lineInput').val().split(' ');
    const hints = correctLine.split(' ');
    if (inputLength != inputArray.length) { // first hint
      finalScore -= 2;
      const hintTrans = '';
      const hintWord = hints[inputArray.length - 1];
      const hintUrlWord = hintUrl + hintWord; // made this way to reuse hintUrl;
      $.ajax({
        url: hintUrlWord,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
          $('#hint').html('hint: ' + data.translated);
        }
      });
      inputLength = inputArray.length;
    } else {
      finalScore -= 3;
      $('#hint').html('hint: ' + hints[inputArray.length - 1]);
    }

    //return hints[inputArray.length - 1];
  });


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
