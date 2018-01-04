const axios = require('axios');
const async = require('async');

function fetchStories(callback) {
  axios.get('https://hacker-news.firebaseio.com/v0/topstories.json')
  .then(function(response) {
    let topStories = [];

    for (var i = 0; i < 15; i++) {
      topStories.push(response.data[i]);
    }

    callback(null, topStories);
  });
}

function fetchStoryDetails(storyNumber, callback) {
  axios.get('https://hacker-news.firebaseio.com/v0/item/' + storyNumber + '.json')
  .then(function(response) {
    callback(null, response.data);
  });
}

module.exports = {
  get: function(callback) {
    async.waterfall([
      (cb) => fetchStories(cb),
      (topStories, cb) => {
        let parallelFunctions = [];

        topStories.forEach(function(story) {
          parallelFunctions.push((done) => fetchStoryDetails(story, done));
        });

        async.parallelLimit(parallelFunctions, 10, cb);
      }
    ], function(error, results) {
      const stories = results.map(function(data, index) {
        return [index + 1, data.title];
      });

      callback(stories);
    });
  }
};

