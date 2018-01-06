const axios = require('axios');
const config = require('./config');

function get(callback) {
  const API = 'https://newsapi.org/v2/';
  const QUERY = 'everything';
  const QUERYSTRING = `?sources=crypto-coins-news&apiKey=${process.env.NEWSAPI_TOKEN}`;

  axios.get(`${API}/${QUERY}/${QUERYSTRING}`)
    .then(function(response) {
      const articles = response.data.articles;
      let news = [];

      for (var i = 0; i < 12; i++) {
        news.push(articles[i].title);
      }

      callback(news);
    });
}

module.exports = { get, config };

