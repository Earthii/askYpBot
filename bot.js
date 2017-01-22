/*!
 * Bot.js : A Twitter bot that can retweet in response to the tweets matching particluar keyword
 * Version 1.0.0
 * Created by Debashis Barman (http://www.debashisbarman.in)
 * License : http://creativecommons.org/licenses/by-sa/3.0
 */

/* Configure the Twitter API */
var TWITTER_CONSUMER_KEY = '1AqwD0kpnPrc9KYepDmJcGWA1';
var TWITTER_CONSUMER_SECRET = 'Ic5oqlDbwxwLyK4i62jX7r1wyGwDFhFuYcTL3CteLo8gdTLL2N';
var TWITTER_ACCESS_TOKEN = '822836654117359616-G9BVWUb1PIYHTlIzeWEZOMklfdtpqpg';
var TWITTER_ACCESS_TOKEN_SECRET = 'KyF2akBMlNOGYpJ59MMhYua5gmYkfggrFOCMe5KmaV6Jf';

/* Set Twitter search phrase */
var TWITTER_SEARCH_PHRASE = '#askYP2';

//Dependencies
var Twit = require('twit');
var langProcess = require('./lang-process');
var ypAPI = require('./yp-api');
var Clarifai = require('clarifai');
var GoogleURL = require('google-url');

//Tools
var lgProcessor = new langProcess();
var yellowPAPI = new ypAPI();
var imgProcessor = new Clarifai.App(
    'Wak0iOj8Y4mrhiKHvwXIzx0aLNzjsYPmAUN90DR5',
    'KP-2ZhAW5EFxeKFUn5Sd_KOebdgxYvSIPJRoSqGP'
);
var googleURL = new GoogleURL({key:'AIzaSyAzz6i6kkgX_I62ZQueX8-ZWOtTfi9Emd8'});


//THE BOT
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

			function BotRetweeted(error, response) {
				if (error) {
					console.log('Bot could not retweet and already answered, : ' + error);
				}
				else {
					var imgName ='';
					if(tweet.entities.media){
						console.log('image found');
                        imgProcessor.models.predict(Clarifai.GENERAL_MODEL, tweet.entities.media[0].media_url).then(
                            function(response) {
                            	imgName = response.outputs[0].data.concepts[0].name;
                                var outputString = 'Image: '+ response.outputs[0].data.concepts[0].name +', Probability: '+Math.round(response.outputs[0].data.concepts[0].value *100,-1)+'%.';
                                yellowPAPI.search(imgName,{long:-73.553,lat:45.087},function(err,results){
                                    if(err){
                                        outputString += " Not related to any business";
										//tweet sent
                                        Bot.post('statuses/update', { status: '@'+retweetUser.screen_name+' '+outputString}, function(err, data, response) {
                                            console.log('Bot retweeted : ' + id.id);
                                            console.log('Bot answered :' + retweetUser.id_str);
                                        });
                                    }else{
                                        googleURL.shorten( results[0].url, function( err, shortUrl ) {
                                            // shortUrl should be http://goo.gl/BzpZ54
											var url = shortUrl;
                                            outputString += " May relate to "+results[0].title + ' at '+results[0].address+'. '+ url;
                                            //tweet sent
                                            Bot.post('statuses/update', { status: '@'+retweetUser.screen_name+' '+outputString}, function(err, data, response) {
                                                console.log('Bot retweeted : ' + id.id);
                                                console.log('Bot answered :' + retweetUser.id_str);
                                            });

                                        });
                                    }
                                });

                            },
                            function(err) {
                                console.error(err);
                            }
                        );
					}
					else{
						console.log('no image found');
                        lgProcessor.queryProduct(tweet.text,function(err,products){
                            var arrayOfKeyword = products;
                            yellowPAPI.search(imgName,{long:-73.553,lat:45.087},function(err,results){

                            });
                            yellowPAPI.search(arrayOfKeyword[0],{long:-73.553,lat:45.087},function(err,results){
                                googleURL.shorten( results[0].url, function( err, shortUrl ) {
                                    // shortUrl should be http://goo.gl/BzpZ54
                                    var url = shortUrl
                                    var response = results[0].title + ' at '+results[0].address+'.'+' Their Website is '+ url;
                                    Bot.post('statuses/update', { status: '@'+retweetUser.screen_name+' '+response}, function(err, data, response) {
                                        console.log('Bot retweeted : ' + id.id);
                                        console.log('Bot answered :' + retweetUser.id_str);
                                    });
                                });

                            });
                        });
                    }


				}
			}
		}
	}
	
	/* Set an interval of 10 minutes (in microsecondes) */

	setInterval(BotRetweet, 10*60*1000);
}

/* Initiate the Bot */
BotInit();