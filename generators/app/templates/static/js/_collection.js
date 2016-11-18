(function(root, $, Kinvey) {
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

    return html;
  }

  root.app = root.app || {};
  root.app['<%= collection %>'] = {
    refresh: function() {
      // Load the books
      var store = Kinvey.DataStore.collection('<%= collection %>');
      store.useDeltaFetch = true;
      store.find()
        .subscribe(function(entities) {
          var html = renderTable(entities);
          $('#collection').html(html);
        });
    }
  };
})(window, window.$, window.Kinvey);

