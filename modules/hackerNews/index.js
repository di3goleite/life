const axios = require('axios');
const async = require('async');
const config = require('./config');

function fetchStories(callback) {
  axios.get('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(function(response) {
      let topStories = [];

      for (var i = 0; i < 12; i++) {
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

function get(callback) {
  async.waterfall([
    (cb) => fetchStories(cb),
    (topStories, cb) => {
      let parallelFunctions = [];

      topStories.forEach(function(story) {
        parallelFunctions.push((done) => fetchStoryDetails(story, done));
      });

      async.parallelLimit(parallelFunctions, 10, function(error, results) {
        cb(null, {topStories: topStories, results: results});
      });
    }
  ], function(error, response) {
    let i, j;
    const stories = [];

    for(i = 0; i < response.topStories.length; i++) {
      for(j = 0; j < response.results.length; j++) {
        if(response.topStories[i] === response.results[j].id) {
          stories.push(response.results[j].title);
          break;
        }
      }
    }

    callback(stories);
  });
}

module.exports = { get, config };

