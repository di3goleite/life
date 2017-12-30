const axios = require('axios')
const currentCity = 'Feira de Santana'
const displayInCelsius = true
const yahooAPI = 'https://query.yahooapis.com/v1/public/yql?q='
const yahooQueryString = encodeURI(`select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${currentCity}")`)

function tempString(temp, celsius) {
	let slug = 'F' 
	if(celsius) {
		slug = 'C'
		temp = Math.round((temp -32) * 5 / 9)
	}
	return `${ temp } º${slug}`
}

let weatherPromise = new Promise((resolve, reject) => {
	axios
	.get(`${yahooAPI}${yahooQueryString}&format=json`)
	.then((res) => {
		
		let results = res.data.query.results.channel
		let nextDays = []
		
		results.item.forecast.splice(1, 4).forEach(function(item){
			item.high = tempString(item.high, displayInCelsius)
			item.low = tempString(item.low, displayInCelsius)
			nextDays.push(item)
		})
		
		let data = {
			location: `${results.location.city} - ${results.location.region}. ${results.location.country}`,
			temp: tempString(results.item.condition.temp, displayInCelsius),
			code: results.item.condition.code,
			nextDays: nextDays
		}

		/**
		* TO DO: Connect ilustration with temp
		* JS object with ilustrations can be found here: https://gist.github.com/cbo317110/d03a1cb7fa17d7fc0d2d43b74a643425
		**/
		resolve([
			"                                      ",
			"                                      ",
			"   \033[38;5;226m    \\   /    \033[0m  " + data.location,
			"   \033[38;5;226m     .-.     \033[0m   ",
			"   \033[38;5;226m  ‒ (   ) ‒  \033[0m  " + data.temp,
			"   \033[38;5;226m     `-᾿     \033[0m   ",
			"   \033[38;5;226m    /   \\    \033[0m  " + new Date(),
			"                                      ",
			"                                      ",
			"                                      ",
			`     ${nextDays[0].date}`
			+`       ${nextDays[1].date}`
			+`       ${nextDays[2].date}`,
			"                                      ",
			`     ${nextDays[0].high} / ${nextDays[0].low}`
			+`     ${nextDays[1].high} / ${nextDays[1].low}`
			+`     ${nextDays[2].high} / ${nextDays[2].low}`

		])

	})
	.catch((err) => {
		reject('Error during request of wheater', err)
	})
})

module.exports = weatherPromise