var Twit = require("twit");
//var config = require('./config.json');

//console.log(config);

localStorage.setItem('threshold', '11');


var T = new Twit(
  {
      "consumer_key":         "ULVFOWWRwPBG31JmCSk3pA9WY",
      "consumer_secret":      "GkpPuajWIi8OwFNHJMnKaAvLBCQcQZdiNnEViM44eqvTvAXkf7",
      "access_token":         "973403711518183425-CNAn0AQYiT074O0XyALXdU2LiJUzGSg",
      "access_token_secret":  "s986l8COxFydEgyOCSuHrtGRSldyunsKfZh59TRyx1tVd"
  }
);

const regex = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/;
const str = "https://twitter.com/CNN";
let m;


function readUserID(thisUrl, callback){
  if ((m = regex.exec(thisUrl)) !== null) {
      // The result can be accessed through the `m`-variable.
      var screen_name = m[1];
      console.log(`Searching for tweets by ${m[1]}`);
      callback(screen_name);
  };
}
function grabTweets(screen_name){
  var params = {
      screen_name: screen_name,
      count: 100
      };

  T.get('statuses/user_timeline', params, function(err, data, response) {
    var tweet_count = data.length;
    for(var i = 0; i < tweet_count; i++){
      console.log(data[i].text);
    }
  });
};

readUserID(str, grabTweets);
