'use strict'
var rp = require('request-promise');
var yosay = require('yosay');

module.exports = {

  baseUrl: "https://manage.kinvey.com/v2",

  token: null,

  login: function (email, password) {

    return rp({
      uri: this.baseUrl + '/session',
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: {
        "email": email,
        "password": password
      },
      json: true
    }).then(function (user) {
      this.token = user.token;
      return user;
    }.bind(this));
  },

  apps: function () {

    return rp({
      uri: this.baseUrl + '/apps',
      method: 'GET',
      headers: {
        'Authorization': 'Kinvey ' + this.token
      },
      json: true
    });
  },

  environments: function (appId) {

    return rp({
      uri: this.baseUrl + '/apps/' + appId + '/environments',
      method: 'GET',
      headers: {
        'Authorization': 'Kinvey ' + this.token
      },
      json: true
    });
  },

  collections: function (environmentId) {

    return rp({
      uri: this.baseUrl + '/environments/' + environmentId + '/collections',
      method: 'GET',
      headers: {
        'Authorization': 'Kinvey ' + this.token
      },
      json: true
    });
  }
}
