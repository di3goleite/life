const axios = require('axios');
const trending = require('trending-github');
const config = require('./config');

function get(callback) {
  trending()
    .then(function(response) {
      let repos = [];

      for (var i = 0; i < 12; i++) {
        repos.push(`${response[i].author}/${response[i].name}`);
      }

      callback(repos);
    })
}

module.exports = { get, config };

