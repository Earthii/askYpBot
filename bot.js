/*!
 * Bot.js : A Twitter bot that can retweet in response to the tweets matching particluar keyword
 * Version 1.0.0
 * Created by Debashis Barman (http://www.debashisbarman.in)
 * License : http://creativecommons.org/licenses/by-sa/3.0
 */

/* Configure the Twitter API */
var TWITTER_CONSUMER_KEY = 'VwdTm9hKOpXYPMaymRMYPrV8k';
var TWITTER_CONSUMER_SECRET = 'sfmbpJvHI3GNNHNI1tyllx1VRcoKRoOfLE57h9abXbdpdU7czu';
var TWITTER_ACCESS_TOKEN = '822836654117359616-XDxeWWq66bWBK9tCIydfSuG9fWSRd6T';
var TWITTER_ACCESS_TOKEN_SECRET = 'ghEmWdQvtNbFwxI5DzqYzM0IasyI95SLwGaPxNQfKL0jG';

/* Set Twitter search phrase */
var TWITTER_SEARCH_PHRASE = '#askYP2';

var Twit = require('twit');
var langProcess = require('./lang-process');
var ypAPI = require('./yp-api');

var lgProcessor = new langProcess();
var yellowPAPI = new ypAPI();

var Bot = new Twit({
	consumer_key: TWITTER_CONSUMER_KEY,
	consumer_secret: TWITTER_CONSUMER_SECRET,
	access_token: TWITTER_ACCESS_TOKEN, 
	access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

console.log('The bot is running...');

/* BotInit() : To initiate the bot */
function BotInit() {
	BotRetweet();
}

/* BotRetweet() : To retweet the matching recent tweet */
function BotRetweet() {

	var query = {
		q: TWITTER_SEARCH_PHRASE,
		result_type: "recent"
	}

	Bot.get('search/tweets', query, BotGotLatestTweet);

	function BotGotLatestTweet (error, data, response) {
		if (error || data.statuses.length <= 0) {
			console.log('Bot could not find latest tweet, : ' + error);
		}
		else {
            var tweet = data.statuses[0];
			var id = {
				id : data.statuses[0].id_str
			};
            var retweetUser = data.statuses[0].user;
			Bot.post('statuses/retweet/:id', id, BotRetweeted);

			//get info on one single tweet
			// Bot.get('statuses/show/:id',{id:'822928111453007872'},function(err,data,res){
			// 	console.log(data)
			// });

			function BotRetweeted(error, response) {
				if (error) {
					console.log('Bot could not retweet and already answered, : ' + error);
				}
				else {
					// if(tweet.place)
					// 	Bot.get('geo/id/:id',{id:tweet.place.id},function(err,data,res){
					// 		console.log(data.bounding_box.coordinates);
					// 	})
                    lgProcessor.queryProduct(tweet.text,function(err,products){
                    	var arrayOfKeyword = products;
                        yellowPAPI.search(arrayOfKeyword[0],{long:-73.553,lat:45.087},function(err,results){
							var response = results[0].title + ' at '+results[0].address+'.'+' Their Website is '+ results[0].url;
                            Bot.post('statuses/update', { status: '@'+retweetUser.screen_name+' '+response}, function(err, data, response) {
                                console.log('Bot retweeted : ' + id.id);
                                console.log('Bot answered :' + retweetUser.id_str);
                            });
						});
					});


				}
			}
		}
	}
	
	/* Set an interval of 10 minutes (in microsecondes) */

	setInterval(BotRetweet, 10*60*1000);
}

/* Initiate the Bot */
BotInit();