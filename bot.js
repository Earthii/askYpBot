/* Configure the Twitter API */
var TWITTER_CONSUMER_KEY = 'uMMIIreJncbEpaJ7A72IL4eAH';
var TWITTER_CONSUMER_SECRET = 'ak4aTewF6aL7siYyPdlIp03bYmbyG5rkayGSp3DgE0WHk9BRLM';
var TWITTER_ACCESS_TOKEN = '822836654117359616-LSzhIRqaCxoQA5XHxwZx9p1HHDnW8Lb';
var TWITTER_ACCESS_TOKEN_SECRET = '7BIFNmZBFPgxyoifuNSFrjJkMBtNay4TQ3c6TAV2ALTmV';

/* Set Twitter search phrase */
var TWITTER_SEARCH_PHRASE = '#askYP';

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

    var stream = Bot.stream('statuses/filter', {track:[TWITTER_SEARCH_PHRASE]});
    stream.on('message', function(msg){

        var tweet = msg;
        var id = {
            id : msg.id_str
        };
        var retweetUser = msg.user;
        Bot.post('statuses/retweet/:id', id, BotRetweeted);

        function BotRetweeted(error, response) {
            if (error) {
                console.log('Bot could not retweet and already answered, : ' + error);
            }
            else {
                var imgName = '';
                if (tweet.entities.media) {
                    console.log('image found');
                    imgProcessor.models.predict(Clarifai.GENERAL_MODEL, tweet.entities.media[0].media_url).then(
                        function (response) {
                            imgName = response.outputs[0].data.concepts[0].name;
                            var outputString = 'Image: ' + response.outputs[0].data.concepts[0].name + ', Probability: ' + Math.round(response.outputs[0].data.concepts[0].value * 100, -1) + '%.';
                            yellowPAPI.search(imgName, {long: -73.578915, lat: 45.495291}, function (err, results) {
                                if (err) {
                                    outputString += " Not related to any business";
                                    //tweet sent
                                    Bot.post('statuses/update', {status: '@' + retweetUser.screen_name + ' ' + outputString}, function (err, data, response) {
                                        console.log('Bot retweeted : ' + id.id);
                                        console.log('Bot answered :' + retweetUser.id_str);
                                    });
                                } else {
                                    googleURL.shorten(results[0].url, function (err, shortUrl) {
                                        // shortUrl should be http://goo.gl/BzpZ54
                                        var url = shortUrl;
                                        outputString += " May relate to " + results[0].title + ' at ' + results[0].address + '. ' + url;
                                        //tweet sent
                                        Bot.post('statuses/update', {status: '@' + retweetUser.screen_name + ' ' + outputString}, function (err, data, response) {
                                            console.log('Bot retweeted : ' + id.id);
                                            console.log('Bot answered :' + retweetUser.id_str);
                                        });


                                    });
                                }
                            });

                        },
                        function (err) {
                            console.error(err);
                        }
                    );
                }
                else {
                    console.log('no image found');
                    lgProcessor.queryProduct(tweet.text, function (err, products) {
                        var arrayOfKeyword = products;
                        if(arrayOfKeyword.length != 0){
                            yellowPAPI.search(arrayOfKeyword[0], {long: -73.578915, lat: 45.495291}, function (err, results) {
                                googleURL.shorten(results[0].url, function (err, shortUrl) {
                                    // shortUrl should be http://goo.gl/BzpZ54
                                    var url = shortUrl
                                    var response = 'You should visit ' + results[0].title + ' at ' + results[0].address + '.' + ' More info here: ' + url;
                                    console.log(response);
                                    Bot.post('statuses/update', {status: '@' + retweetUser.screen_name + ' ' + response}, function (err, data, response) {
                                        console.log('Bot retweeted : ' + id.id);
                                        console.log('Bot answered :' + retweetUser.id_str);
                                    });

                                });

                            });
                        } else {
                            var response = 'Sorry, we couldn\'t understand your query. Please try again.';
                            console.log(response);
                            Bot.post('statuses/update', {status: '@' + retweetUser.screen_name + ' ' + response}, function (err, data, response) {
                                console.log('Bot retweeted : ' + id.id);
                                console.log('Bot answered :' + retweetUser.id_str);
                            });
                        }
                    });
                }
            }
        }
    });

}

/* Initiate the Bot */
BotInit();