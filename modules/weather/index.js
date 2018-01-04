const axios = require('axios');
const changeCase = require('change-case');
const config = require('./config');

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
          humidity: forecast.humidity,
          temperatureLow: forecast.temperatureLow,
          temperatureHigh: forecast.temperatureHigh,
          precipitationIntensity: forecast.precipIntensity,
          precipitationProbability: forecast.precipProbability
        };
      });

      callback(forecasts);
    });
}

function humanizeDate(epoch) {
  const today = new Date(epoch * 1000);
  let humanizedDate = '';

  today.toString()
    .split(' ')
    .slice(0, 4)
    .forEach(function(fragment) {
      humanizedDate = humanizedDate + fragment + ' ';
    });

  return humanizedDate;
}

function render(data, callback) {
  const ICONS = require('./icons');
  const today = data[0];
  const card = [
    `  ${humanizeDate(today.time)}`,
    `  ${today.summary}`,
    `  ${today.temperatureLow} - ${today.temperatureHigh} ˚C`,
    `  ${today.precipitationIntensity * 1000} mm | ${today.precipitationProbability * 100} %`,
    `  ${today.humidity * 100} %`
  ];

  let output = ICONS[today.icon].map(function(iconSlice, index) {
    return iconSlice + card[index];
  });

  callback(output);
}

module.exports = { get, render, config };

