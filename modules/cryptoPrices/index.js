const axios = require('axios');
const config = require('./config');

function get(callback) {
  axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=15')
    .then(function(response) {
      const coins = response.data.map(function(coin) {
        return [
          coin.symbol,
          coin.price_usd,
          coin.percent_change_24h + '%',
          coin.percent_change_1h + '%'
        ];
      });

      callback(null, coins);
    })
    .catch(function (err) {
      callback(err);
    });
}

module.exports = { get, config };

