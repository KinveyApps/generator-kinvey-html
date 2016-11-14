(function(root, $, Kinvey) {
  // Initialize Kinvey
  // Replace appKey and appSecret with your apps credentials
  Kinvey.init({
    appKey: '<%= env.id %>',
    appSecret: '<%= env.appSecret %>'
  });


  // Get the active user
  var activeUser = Kinvey.User.getActiveUser();

  // Redirect to /login.html if an active user
  // does not exist
  if (activeUser === null) {
    var authorizedHrefs = [
      '/',
      '/index.html',
      <% for (var i = 0, len = collections.length; i < len; i++) { %>
        '/<%= collections[i] %>.html',
      <% } %>
      '/upload.html'
    ];

    if (authorizedHrefs.indexOf(location.pathname) !== -1) {
      location.replace('/login.html');
    }
  } else {
    // Update the drowdown with the account name
    $('#account-dropdown').html((activeUser.data.firstname || 'User') + ' ' + (activeUser.data.lastname || '') + ' <span class="caret"></span>');
  }
})(window, window.$, window.Kinvey);
