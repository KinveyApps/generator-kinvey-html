(function(root, $, Kinvey) {
  root.app = root.app || {};
  root.app.Files = {
    upload: function(file, options) {
      return Kinvey.Files.upload(file, options);
    }
  }
})(window, window.$, window.Kinvey);
