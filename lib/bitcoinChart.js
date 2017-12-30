const axios = require('axios');

module.exports = {
  get: function(callback) {
    axios.get('https://blockchain.info/charts/market-price?timespan=30days&format=json')
    .then(function(response) {
      let xAxis = [];
      let yAxis = [];

      response.data.values.map(function(value) {
        xAxis.push(((new Date(value.x * 1000)).getMonth() + 1) + '/' + (new Date(value.x * 1000)).getDate());
        yAxis.push(value.y);
      });

      callback({time: xAxis, value: yAxis});
    })
  }
};
