(function(root, $, Kinvey) {
  root.app = root.app || {};
  root.app.User = {
    login: function(username, password) {
      return Kinvey.User.login(username, password);
    },
    logout: function() {
      return Kinvey.User.logout();
    },
    update: function(data) {
      var activeUser = Kinvey.User.getActiveUser();
      return activeUser.update(data);
    },
    signup: function(data) {
      return Kinvey.User.signup(data);
    }
  };
})(window, window.$, window.Kinvey);
