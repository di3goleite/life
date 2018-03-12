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
          humidity: Math.ceil(forecast.humidity * 100),
          temperatureLow: Math.ceil(forecast.temperatureLow),
          temperatureHigh: Math.ceil(forecast.temperatureHigh),
          precipitationIntensity: Math.ceil(forecast.precipIntensity * 1000),
          precipitationProbability: Math.ceil(forecast.precipProbability * 100)
        };
      });

      callback(null, forecasts);
    })
    .catch(function(err) {
      callback(err.response.statusText, null);
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
  const cardIcon = data[0].icon;
  const today = [
    `${humanizeDate(data[0].time)}`,
    `${data[0].summary}`,
    `${data[0].temperatureLow} - ${data[0].temperatureHigh}˚C`,
    `${data[0].precipitationIntensity}mm | ${data[0].precipitationProbability}%`,
    `${data[0].humidity}% of humidity`
  ];

  // Generate weather card for today
  let output = ICONS[cardIcon].map(function(iconSlice, index) {
    return iconSlice + '  ' + today[index];
  });

  // Remove first weather prediction
  data.shift();

  // Add empty line to use as separator
  output.unshift(' ');
  output.push(' ');

  // Format weather card for next days
  let nextThreeDays = [
    '  ' +
    humanizeDate(data[0].time) + '  ' +
    humanizeDate(data[1].time) + '  ' +
    humanizeDate(data[2].time),

    '  ' +
    data[0].temperatureLow + ' - ' + data[0].temperatureHigh + '˚C         ' +
    data[1].temperatureLow + ' - ' + data[1].temperatureHigh + '˚C         ' +
    data[2].temperatureLow + ' - ' + data[2].temperatureHigh + '˚C',

    '  ' +
    data[0].precipitationIntensity + ' mm | ' + data[0].precipitationProbability + '%       ' +
    data[1].precipitationIntensity + ' mm | ' + data[1].precipitationProbability + '%       ' +
    data[2].precipitationIntensity + ' mm | ' + data[2].precipitationProbability + '%',

    '  ' +
    data[0].humidity + '% of humidity   ' +
    data[1].humidity + '% of humidity   ' +
    data[2].humidity + '% of humidity'
  ];

  // Put together the card with the next three days prediction
  output = output.concat(nextThreeDays);

  callback(output);
}

module.exports = { get, config, render };

