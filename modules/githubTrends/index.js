const axios = require('axios');
const trending = require('trending-github');
const config = require('./config');

function get(callback) {
  trending()
    .then(function(response) {
      let repos = [];

      for (var i = 0; i < response.length; i++) {
        repos.push(`${response[i].author}/${response[i].name}`);
      }

      callback(null, repos);
    })
    .catch(function (err) {
      callback(err);
    });
}

module.exports = { get, config };

