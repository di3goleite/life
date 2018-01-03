const axios = require('axios');
const pictures = require('./static/weather.ascii.pictures.js');

const API = 'https://query.yahooapis.com/v1/public/yql?q=';
const QUERY = encodeURI(`select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${process.env.WEATHER_CITY}")`);

function tempString(temp, celsius) {
  let slug = 'F';

  if(celsius) {
    slug = 'C';
    temp = Math.round((temp -32) * 5 / 9);
  }

  return `${temp}º${slug}`;
}

let weatherPromise = new Promise((resolve, reject) => {
  axios
  .get(`${API}${QUERY}&format=json`)
  .then((res) => {
    let results = res.data.query.results.channel;
    let nextDays = [];

    results.item.forecast.splice(1, 4).forEach(function(item) {
      item.high = tempString(item.high, process.env.WEATHER_CELSIUS);
      item.low = tempString(item.low, process.env.WEATHER_CELSIUS);
      nextDays.push(item);
    });

    let location = `${results.location.city} - ${results.location.region}. ${results.location.country}`;
    let high = tempString(results.item.forecast[0].high, process.env.WEATHER_CELSIUS);
    let low = tempString(results.item.forecast[0].low, process.env.WEATHER_CELSIUS)
    let temp =  `${high} / ${low}`;
    let code = results.item.forecast[0].code;
    let text = results.item.forecast[0].text;

    let result = [];
    let picture = pictures.hasOwnProperty(code) ? pictures[code] : pictures[100];
    let picture_slice = '';

    let date = new Date().toString().split(" ");
    let today = '';

    for(var i=0; i < date.length-2; i++) {
      today = today + date[i] + ' ';
    }

    result.push("\n");

    for (var i = 0; i < 5; i++) {
      picture_slice = picture[i];
      if(i == 0) picture_slice += `    ${location}`;
      if(i == 1) picture_slice += `    ${today}`;
      if(i == 2) picture_slice += `    ${temp}`;
      if(i == 3) picture_slice += `    ${text}`;
      result.push("    " + picture_slice);
    }

    result.push(" ");
    result.push(
      `  ${nextDays[0].date}    ` +
      `  ${nextDays[1].date}    ` +
      `  ${nextDays[2].date}    `
    );

    result.push(
      `  ${nextDays[0].high} / ${nextDays[0].low}    ` +
      `  ${nextDays[1].high} / ${nextDays[1].low}    ` +
      `  ${nextDays[2].high} / ${nextDays[2].low}    `
    );

    result.push(
      `  ${nextDays[0].text}  ` +
      `  ${nextDays[1].text}  ` +
      `  ${nextDays[2].text}  `
    );

    resolve(result);
  })
  .catch((err) => {
    reject('Error during request of wheater', err);
  });
});

module.exports = weatherPromise;
