const OAuth = require('oauth');
const config = require('./config');

function oauth() {
  return new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.TWITTER_CONSUMER_KEY,
    process.env.TWITTER_CONSUMER_SECRET,
    '1.0A',
    null,
    'HMAC-SHA1'
  );
}

function get(callback) {
  oauth().get(
    'https://api.twitter.com/1.1/trends/place.json?id=1',
    process.env.TWITTER_ACCESS_TOKEN,
    process.env.TWITTER_ACCESS_TOKEN_SECRET,
    function(error, data, response) {
      if (error) {
        return callback(JSON.parse(error.data).errors[0].message, null);
      }
      const trends = JSON.parse(data)[0].trends
        .map(function(trend) {
          return trend.name;
        })
        .filter(function(trend) {
          return !/[\u0600-\u06FF]/.test(trend);
        });

      callback(null, trends.slice(0, 12));
    });
}

module.exports = { get, config };

