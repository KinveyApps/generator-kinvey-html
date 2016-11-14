(function(root, $, Kinvey) {
  // Get the active user
  var activeUser = Kinvey.User.getActiveUser();

  if (activeUser !== null) {
    // Render the table
    function renderTable(entites) {
      // Default entites to an empty array
      entites = entites || [];

      // Create the rows
      var rows = entites.map(function(entity) {
        return '<tr>\n'
          + '<td>' + entity._id + '</td>\n'
          + '<td>' + JSON.stringify(entity._acl) + '</td>\n'
          + '<td>' + JSON.stringify(entity._kmd) + '</td>\n'
          + '</tr>';
      });

      // Create the table
      var html = '<table class="table table-striped">\n'
        +    '<thead>\n'
        +      '<tr>\n'
        +        '<th>_id</th>\n'
        +        '<th>_acl</th>\n'
        +        '<th>_kmd</th>\n'
        +      '</tr>\n'
        +    '</thead>\n'
        +    '<tbody>\n'
        +      rows.join('')
        +    '</tbody>\n'
        +  '</table>\n';

        // Add the html to the page
        $('#collection').html(html);
    }

    // Load the books
    var store = Kinvey.DataStore.collection('<%= collection %>');
    store.find()
      .subscribe(function(entities) {
        renderTable(entities);
      });
  }
})(window, window.$, window.Kinvey);
