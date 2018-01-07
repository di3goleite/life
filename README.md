# Life
:rocket: Extensible dashboard to keep the important things visible and save your life

## Screenshot
![First Version](assets/screenshot.png)

## Configure
Generate the environment variable values, see `.env.example`:
* [Twitter Apps](https://apps.twitter.com/)
* [Forecast.io](http://forecast.io/)
* [NewsAPI.org](https://newsapi.org/)

Create the `.env` file and insert the generated values:
```
cp .env.example .env
```

## Install
```
$ npm install
```

## Run
```
$ npm start
```

## Roadmap [v1.0.0]
- [ ] Modules
  - [x] Bitcoin Chart
  - [x] Cryptocurrency Prices
  - [x] GitHub Trends
  - [x] Hacker News
  - [x] Twitter Trends
  - [x] Weather
  - [ ] Google Calendar
  - [x] Cryptocurrency News
  - [ ] Overflow News
  - [ ] Alarm
  - [ ] Clock

- [ ] Features
  - [ ] Realtime modules refresh
  - [ ] Style modules with color, font and spacing
  - [ ] Navigate on the modules with keyboard arrows
  - [ ] Set a module as full screen
  - [ ] Interact with modules
  - [ ] Open link and render page inside the terminal

- [ ] Bugfixes
  - [ ] Startup performance issue with Raspberry Pi Zero W
  - [ ] Wrong characters symbols for Raspberry Pi Zero W
  - [ ] Responsiveness

