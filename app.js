const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen();
const grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

// News column
grid.set(0, 0, 4, 4, blessed.box, {label: 'Hacker News'});
grid.set(4, 0, 4, 4, blessed.box, {label: 'Overflow News'});
grid.set(8, 0, 4, 2, blessed.box, {label: 'Twitter Top Trends'});
grid.set(8, 2, 4, 2, blessed.box, {label: 'GitHub Trends'});

// Money column
grid.set(0, 4, 4, 4, blessed.box, {label: 'Bitcoin Chart'});
grid.set(4, 4, 4, 4, blessed.box, {label: 'Crypto Prices'});
grid.set(8, 4, 4, 4, blessed.box, {label: 'Crypto News'});

// Organization column
grid.set(0, 8, 4, 4, blessed.box, {label: 'Google Calendar'});
grid.set(4, 8, 4, 4, blessed.box, {label: 'Weather'});
grid.set(8, 8, 4, 2, blessed.box, {label: 'Alarm'});
grid.set(8, 10, 4, 2, blessed.box, {label: 'Clock'});

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

screen.render();