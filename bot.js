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
var TWITTER_SEARCH_PHRASE = '#askYP1';

var Twit = require('twit');

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
    var obj = Bot.get('search/tweets', { q: '#askYP1 since:2017-01-20', count: 5 }, function(err, data, response) {
      console.log(data);
        for(var i = 0; i< data.statuses.length ; i++){
        	console.log(data.statuses[i].user);
            //printing out the geo coordinates if !null
			if(data.statuses[i].geo != null){
        		console.log(data.statuses[i].lat);
        		console.log(data.statuses[i].long);
			}
			//printing out coordinates if !null
			if(data.statuses[i].coordinates !=null){
				console.log(data.statuses[i].coordinates[0][1]);
                console.log(data.statuses[i].coordinates[0][2]);
                console.log(data.statuses[i].coordinates[0][3]);
                console.log(data.statuses[i].coordinates[0][4]);
			}
            //printing out the place if !null
            if(data.statuses[i].place != null){
                console.log(data.statuses[i].place);
                console.log(data.statuses[i].place.full_name);
                console.log();
            }
        }
    });

	function BotGotLatestTweet (error, data, response) {
		if (error) {
				console.log('Bot could not find latest tweet, : ' + error);
		}
		else {
			var id = {
				id : data.statuses[0].id_str
			}

			Bot.post('statuses/retweet/:id', id, BotRetweeted);
			
			function BotRetweeted(error, response) {
				if (error) {
					console.log('Bot could not retweet, : ' + error);
				}
				else {
					console.log('Bot retweeted : ' + id.id);
				}
			}
		}
	}
	
	/* Set an interval of 30 minutes (in microsecondes) */
	setInterval(BotRetweet, 30*60*1000);
}

/* Initiate the Bot */
BotInit();