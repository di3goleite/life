require('dotenv').load();

const blessed = require('blessed');
const contrib = require('blessed-contrib');
const m = require('./modules');

const screen = blessed.screen();
const grid = new contrib.grid({rows: 12, cols: 12, screen: screen});


// Hacker News
const hackerNews = grid.set(0, 0, 4, 4, contrib.log, m.hackerNews.config);


m.hackerNews.get(function(lines) {
  lines.forEach(function(line) {
    hackerNews.log(line);
  });
});

// Overflow News
grid.set(4, 0, 4, 4, blessed.box, {label: 'Overflow News'});

// Twitter Trends
const twitterTrends = grid.set(8, 0, 4, 2, contrib.log, m.twitterTrends.config);

m.twitterTrends.get(function(err, lines) {
  if (err) return twitterTrends.log(err);
  lines.forEach(function (line) {
    twitterTrends.log(line);
  });
});

// GitHub Trends
const githubTrends = grid.set(8, 2, 4, 2, contrib.log, m.githubTrends.config);

m.githubTrends.get(function(err, lines) {
  if (err) return githubTrends.log(err);
  lines.forEach(function(line) {
    githubTrends.log(line);
  });
});

// Bitcoin Chart
const bitcoinChart = grid.set(0, 4, 4, 4, contrib.line, m.bitcoinChart.config);

m.bitcoinChart.get(function(err, data) {
  if (err) return bitcoinChart.setContent(err);
  bitcoinChart.setData({
    title: 'Bitcoin (USD)',
    x: data.time,
    y: data.value
  });
});

// Crypto Prices
const cryptoPrices = grid.set(4, 4, 4, 4, contrib.table, m.cryptoPrices.config);

m.cryptoPrices.get(function(err, data) {
  if (err) return cryptoPrices.setContent(err);
  cryptoPrices.setData({
    headers: ['Coin', 'Price (USD)', 'Change (24H)', 'Change (1H)'],
    data: data
  });
});

// Crypto News
const cryptoNews = grid.set(8, 4, 4, 4, contrib.log, m.cryptoNews.config);

m.cryptoNews.get(function(err, news){
  if (err) return cryptoNews.log(err);
  news.forEach(function(title){
    cryptoNews.log(title);
  })
});

// Weather
const weather = grid.set(0, 8, 4, 4, blessed.log, m.weather.config);

m.weather.get(function(err, data) {
  if (err) return weather.log(err);
  m.weather.render(data, function(lines) {
    lines.forEach(function(line) {
      weather.log(line);
    });
  });
});

// Google Calendar
grid.set(4, 8, 4, 4, blessed.box, {label: 'Google Calendar'});

// Alarm
grid.set(8, 8, 4, 2, blessed.box, {label: 'Alarm'});

// Clock
const clock = grid.set(8, 10, 4, 2, blessed.box, m.clock.config);

m.clock.get(function(data) {
  clock.setContent(data);
  screen.render();
});

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

screen.children.forEach(child => {
  let oldTop, oldLeft, oldWidth, oldHeight;

  child.on('click', function (data) {
    if (child.width > oldWidth && child.height > oldHeight) {
      child.width = oldWidth;
      child.height = oldHeight;
      child.top = oldTop;
      child.left = oldLeft;
    }
    else {
      oldWidth = child.width;
      oldHeight = child.height;
      oldTop = child.top;
      oldLeft = child.left;
      child.setFront();
      child.focus();
      child.width = '100%';
      child.height = '100%';
      child.top = 0;
      child.left = 0;
    }
    screen.render();
  });
});

screen.render();
