const axios = require('axios');
const trending = require('trending-github');

module.exports = {
  get: function(callback) {
    trending()
    .then(function(response) {
      const repos = response.map(function(repo) {
        return [
          repo.stars,
          repo.name
        ];
      });

      callback(repos);
    })
  }
};

