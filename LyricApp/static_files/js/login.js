$(() => {
  function login(username, password) {
    $.ajax({
      url: 'accounts',
      type: 'POST',
      dataType: 'json',
      data: {
        username: username,
        password: password
      },
      success: (data) => {
        /* band-aid because the server should send an error code, not the client-side handling it */
        if (!data.username) {
          $('#login-message').html('<p>Invalid Username or Password</p>');
        } else {
          sessionStorage.username = data.username;
          $('#login-message').html('<p>Welcome, ' + sessionStorage.username + '!</p>');
          $('#logout-text').html('<p>Currently logged in as: ' + sessionStorage.username + '</p>');
          $('#create-message').empty();
          $('#login').css('display', 'none');
          $('#logout').css('display', 'block');
        }
      }
    });
  }

  // Login form
  $('#login').submit((e) => {
    e.preventDefault();
    if (validate('#login', '#login-message')) {
       login($('#login input[name=username]').val(), $('#login input[name=password]').val());
    }
  });
  
  $('#logout-submit').click(() => {
    let isLoggedIn = true;
    
    if (!sessionStorage.username || sessionStorage.username === '') {
      isLoggedIn = false;
    }

    if (isLoggedIn) {
      $('#login').css('display', 'block');
      
      $('#login-message').html(sessionStorage.username + ' is now logged out.');
      $('#logout').css('display', 'none');
      
      sessionStorage.username = '';
    }
    else {
      $('#login-message').html('No user currently signed in.');
    }
  });
  
  // Sign up/Create Account form
  $('#signup').submit((e) => {
    e.preventDefault();
    if (validate('#signup', '#create-message')) {
      const username = $('#signup input[name=username]').val();
      const password = $('#signup input[name=password]').val();
      $.ajax({
        url: 'createAccount',
        type: 'POST',
        dataType: 'json',
        data: {
          username: username,
          password: password
        },
        success: (data) => {
          $('#create-message').html('<p>' + data.message + '</p>');
          if (data.status) {
            login(username, password);
          }
        }
      });
    }
  });
  
  if (!sessionStorage.username || sessionStorage.username === '') {
    $('#login').css('display', 'block');
    $('#logout').css('display', 'none');
  } else {
    $('#logout-text').html('<p>Currently logged in as: ' + sessionStorage.username + '</p>');
    $('#login').css('display', 'none');
    $('#logout').css('display', 'block');
  }
});