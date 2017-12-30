const OAuth = require('oauth')

class TwitterRequest {

  constructor(auth) {
    let validationErrors = 0
    if(typeof auth != 'object') validationErrors++
    ['consumerKey', 'consumerSecret', 'accessToken', 'accessTokenSecret']
    .forEach((key) => {
      if(!auth.hasOwnProperty(key)) validationErrors++
    })
    if(!validationErrors) {
      this.valid = true
      this.auth = auth
    }
  }

  trends(place, count) {
    place = !place ? 10 : place
    // 1 means 'global'
    count = !count ? 1 : count
    return new Promise((resolve, reject) => {
      this.authMiddleware().get(
        `https://api.twitter.com/1.1/trends/place.json?id=${place}`,
        this.auth.accessToken,
        this.auth.accessTokenSecret,
        (error, data, response) => {
          if (error) reject(error)
          let trends = []
          JSON.parse(data)[0].trends.forEach(function(item){
            let  arabic_range = /[\u0600-\u06FF]/;
            if(!arabic_range.test(item.name)) trends.push(item.name)
          })
          if(trends.length > 1) resolve(trends.slice(0, count))
          reject('Error during request of #trends')
        }
      )
    })
  }

  authMiddleware() {
    return new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      this.auth.consumerKey,
      this.auth.consumerSecret,
      '1.0A',
      null,
      'HMAC-SHA1'
    )
  }

}

module.exports = {
  get() {
    twitterReq = new TwitterRequest({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    })
    return twitterReq.trends(1, 15)
  }
}