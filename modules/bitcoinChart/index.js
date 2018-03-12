const axios = require('axios');
const config = require('./config');

function get(callback) {
  axios.get('https://blockchain.info/charts/market-price?timespan=30days&format=json')
    .then(function(response) {
      let xAxis = [];
      let yAxis = [];

      response.data.values.forEach(function(value) {
        xAxis.push(((new Date(value.x * 1000)).getMonth() + 1) + '/' + (new Date(value.x * 1000)).getDate());
        yAxis.push(value.y);
      });

      callback(null, {time: xAxis.slice(-6), value: yAxis.slice(-6)});
    })
    .catch(function (err) {
      callback(err, null);
    });
}

module.exports = { get, config };

