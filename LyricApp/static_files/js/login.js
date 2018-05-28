$(() => {
  $('#login-submit').click(() => {
    let isValidInput = true;
    
    if (!$('#login-username').val()) {
      isValidInput = false;
    }
    if (!$('#login-password').val()) {
      isValidInput = false;
    }

    if (isValidInput) {
      const username = $('#login-username').val();
      const password = $('#login-password').val();      
      const URL = 'accounts/' + username + '/' + password;
      $.ajax({
        url: URL,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
          /* band-aid because the server should send an error code, not the client-side handling it */
          if (!data.username) {
            $('#login-message').html("<p>Invalid Username or Password</p>");
          }
          else {
            sessionStorage.username = data.username;
            sessionStorage.password = data.password;
            
            $('#login-message').html('<p>Welcome, ' + sessionStorage.username + "!</p>");
            $('#logout-text').html('<p>Currently logged in as: ' + sessionStorage.username + '</p>');
            $('#create-message').html("");
          }
        }
      });
      
      $('#login').css('display', 'none');
      $('#logout').css('display', 'block');
    }
    else {
      $('#login-message').html("<p>Invalid Username or Password</p>");
    }
  });
  
  $('#logout-submit').click(() => {
    let isLoggedIn = true;
    
    if (!sessionStorage.username || sessionStorage.username === '') {
      isLoggedIn = false;
    }

    if (isLoggedIn) {
      $('#login').css('display', 'block');
      
      $('#login-message').html(sessionStorage.username + " is now logged out.");
      $('#logout').css('display', 'none');
      
      sessionStorage.username  = '';
      sessionStorage.password = '';
    }
    else {
      $('#login-message').html("No user currently signed in.");
    }
  });
  
  $('#create-submit').click(() => {
    let isValidInput = true;
    
    if (!$('#create-username').val()) {
      isValidInput = false;
    }
    if (!$('#create-password').val()) {
      isValidInput = false;
    }
    
    if (isValidInput) {
      const user = $('#create-username').val();
      const pass = $('#create-password').val();
      
      $.ajax({
        url: "createAccount",
        type: "POST",
        dataType: 'json',
        data: {
          username: user,
          password: pass,
        },
        success: (data) => {
          if (!data.message) {            
            $('#create-message').html(user + " account created.");
          }
          else {
            $('#create-message').html("<p>" + data.message + "</p>");
          }
        }
      });
    }
    else {
      $('#create-message').html("<p>Invalid Username or Password</p>");
    }
  });
  
  if (!sessionStorage.username || sessionStorage.username === '') {
    $('#login').css('display', 'block');
    $('#logout').css('display', 'none');
  }
  else {
    $('#logout-text').html('<p>Currently logged in as: ' + sessionStorage.username + '</p>');
    $('#login').css('display', 'none');
    $('#logout').css('display', 'block');
  }
});