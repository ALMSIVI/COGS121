$(document).ready(() => {
    let nextLine = "";
    let translatedLyrics = "";
    let lineCounter = 0;
    let originalLyrics = "";

  $('#readLyrics').click(() => {
    const requestURL = 'songs/' + $('#newSong').val();
    const tlyricURL = 'songs/' + $('#newSong').val(); + '/tlyric'
    const originalLyric = $('#lyrics').val();
    const translatedLyric = $('#translatedlyrics').val();
    const songName = $('#newSong').val();
    //console.log('read button clicked!');
    console.log(originalLyric);
    $.ajax({
      url: requestURL,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        //console.log(data);
        if(data.original) {
          //$('#status').html('Song already exists at URL: ' + requestURL);
          //$('#jobDiv').html('My job is ' + data.job);
          //$('#petImage').attr('src', data.pet);
        } else {
          //$('#status').html('Error: could not find user at URL: ' + requestURL);
        }
      }
    });

    $.ajax({
      url: requestURL,
      type: "POST",
      dataType: 'json',
      data: {
                'original': originalLyric,
                'translated': translatedLyric
            },
      success: (data) => {
          $('#status').html("\"" + songName + "\" was successfully added.");
        //status later
      }
    });
  });

  $('#songSelection').click(() => {
    const songName = $('#songname').val();
    const songSelectURL = 'select/' + songName;
    $.ajax({
      url: songSelectURL,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        nextLine = data.translated.split('\n')[0];
        correctLine = data.original.split('\n')[0];
        correctLine = correctLine.replace(/\s+/g,' ').trim();
        translatedLyrics = data.translated;
        originalLyrics = data.original;
        $('#originalarea').html('Original: \n' + '<pre>' + nextLine + '</pre>');

        //$('#translatedarea').html('Translated: \n' + '<pre>' + data.translated + '</pre>');
      }
    })
  })
//test
  $("#lineInput").keyup(function(event) {//Enter Key
      if (event.keyCode === 13) {
          $("#checkIfCorrect").click();
      }
  });

  $("#lineInput").keyup(function(event) {//Control Key
      if (event.keyCode === 17) {
        const input = $('#lineInput').val().toUpperCase();
        const correct = correctLine.toUpperCase();
        const wordCheck = findWrong(input, correct);
        $('#hint').html(wordCheck);
      }
  });


  $("#checkIfCorrect").click(function() {
      const input = $('#lineInput').val().toUpperCase();
      const correct = correctLine.toUpperCase();
      if (correct == input){
          lineCounter++;

          getNextLine();
          $('#originalarea').html('Original: \n' + '<pre>' + nextLine + '</pre>');
          $('#lineInput').val('');
          $('#hint').html("");
      }
      else {
      const wrongWord = findWrong(input, correct);

      //console.log("correctLine= " + correctLine);
      //console.log($('#lineInput').val());
      $('#hint').html(wrongWord);
    }
  });


  $("#lineInput").keyup(function(event) {//Shift Key
      if (event.keyCode === 16) {
          $('#hint').html("hint: " + getHint());
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
    nextLine = translatedLyrics.split('\n')[lineCounter];
    while ( $.trim(nextLine) == '' ) {
      lineCounter++;
      nextLine = translatedLyrics.split('\n')[lineCounter];
    }
    correctLine = originalLyrics.split('\n')[lineCounter];
    correctLine = correctLine.replace(/\s+/g,' ').trim();
  }

  function findWrong(input, correct) {//input = input line all caps, correct = correctline
    var inputArray = input.split(" ");
    var correctArray = correct.split(" ");
    var counter = 0;
    var response = '';
    while(inputArray[counter] == correctArray[counter]){
      counter++;
    }
    if(counter == inputArray.length){
      response = "All Correct so Far!";
      return response;
    }
    else {
      response = "Wrong word: " + inputArray[counter];
      return response;
    }


  }
  function getHint() {
    var inputArray =  $('#lineInput').val().split(" ");
    var hints = correctLine.split(" ");
    return hints[inputArray.length-1];
  }
//test

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
