const axios = require('axios');
const changeCase = require('change-case');

const config = require('./config');
const icons = require('./icons');

function get(callback) {
  const API = 'https://api.darksky.net/forecast';
  const LOCATION = `${process.env.WEATHER_LATITUDE},${process.env.WEATHER_LONGITUDE}`;
  const QUERY = `${process.env.WEATHER_API_KEY}/${LOCATION}`;
  const QUERYSTRING = `?units=${process.env.WEATHER_UNITS}&exclude=hourly`;

  axios.get(`${API}/${QUERY}/${QUERYSTRING}`)
    .then(function(response) {
      let forecasts = response.data.daily.data.slice(0, 4);

      forecasts = forecasts.map(function(forecast) {
        return {
          icon: changeCase.camel(forecast.icon),
          time: forecast.time,
          summary: forecast.summary,
          temperatureHigh: forecast.temperatureHigh,
          temperatureLow: forecast.temperatureLow,
          precipitationProbability: forecast.precipProbability
        };
      });

      callback(forecasts);
    });
};

module.exports = {
  get: get,
  config: config,
  icons: icons
};

