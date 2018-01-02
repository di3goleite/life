const axios = require('axios');
const pictures = require('./static/weather.ascii.pictures.js');

const currentCity = process.env.WEATHER_CITY;
const displayInCelsius = process.env.WEATHER_CELSIUS;

const yahooAPI = 'https://query.yahooapis.com/v1/public/yql?q=';
const yahooQueryString = encodeURI(`select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${currentCity}")`);

function tempString(temp, celsius) {
  let slug = 'F';

  if(celsius) {
    slug = 'C';
    temp = Math.round((temp -32) * 5 / 9);
  }

  return `${ temp } º${slug}`;
}

let weatherPromise = new Promise((resolve, reject) => {
  axios
  .get(`${yahooAPI}${yahooQueryString}&format=json`)
  .then((res) => {
    let results = res.data.query.results.channel;
    let nextDays = [];

    results.item.forecast.splice(1, 4).forEach(function(item) {
      item.high = tempString(item.high, displayInCelsius);
      item.low = tempString(item.low, displayInCelsius);
      nextDays.push(item);
    });

    let location = `${results.location.city} - ${results.location.region}. ${results.location.country}`;
    let temp = tempString(results.item.condition.temp, displayInCelsius);
    let code = results.item.condition.code;

    let result = [];
    let picture = pictures.hasOwnProperty(code) ? pictures[code] : pictures[100];
    let picture_slice;

    result.push("                                      ");
    result.push("                                      ");

    for (var i = 0; i < 5; i++) {
      picture_slice = picture[i];
      if(i == 0) picture_slice += `    ${location}`;
      if(i == 2) picture_slice += `    ${temp}`;
      if(i == 4) picture_slice += `    ${new Date()}`;
      result.push("    " + picture_slice);
    }

    result.push("                                      ");
    result.push("                                      ");
    result.push(`     ${nextDays[0].date}`
      +`       ${nextDays[1].date}`
      +`       ${nextDays[2].date}`
    );
    result.push("                                      ");
    result.push(`     ${nextDays[0].high} / ${nextDays[0].low}`
      +`     ${nextDays[1].high} / ${nextDays[1].low}`
      +`     ${nextDays[2].high} / ${nextDays[2].low}`
    );

    resolve(result);
  })
  .catch((err) => {
    reject('Error during request of wheater', err);
  });
});

module.exports = weatherPromise;
