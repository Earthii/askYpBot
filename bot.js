/* Set Twitter search phrase */
const TWITTER_SEARCH_PHRASE = '#askYP1';

let Twit = require('twit');
let ProcessLang = require('./lang-process');
let YPAPI = require('./yp-api');

let Watson = new ProcessLang('836929e582b56ff138ef55896dc5efb959fdd50b');
let YellowPages = new YPAPI();

let Bot = new Twit({
	consumer_key: '1AqwD0kpnPrc9KYepDmJcGWA1',
	consumer_secret: 'Ic5oqlDbwxwLyK4i62jX7r1wyGwDFhFuYcTL3CteLo8gdTLL2N',
	access_token: '822836654117359616-G9BVWUb1PIYHTlIzeWEZOMklfdtpqpg',
	access_token_secret: 'KyF2akBMlNOGYpJ59MMhYua5gmYkfggrFOCMe5KmaV6Jf'
});

console.log('The yellow people\'s bot is running...');

let stream = Bot.stream('statuses/filter', {track:[TWITTER_SEARCH_PHRASE]});

stream.on('message', function (msg) {
    console.log("NEW TWEET FAM");
    console.log(JSON.stringify(msg, null, 2));

    let newTweet = [];
    newTweet.push({
        tweetId:msg.user.id,
        username:msg.screen_name,
		message:msg.text
    });

    if(msg.geo){
    	// Get results from yp directly...
		var keyword = Watson.queryProduct(msg.text, function(err, keywords){

		});

	} else {
    	// Ask for postal code...
	}
});

// let query = {
//     q: TWITTER_SEARCH_PHRASE,
//     result_type: "recent"
// }
//
// Bot.get('search/tweets', query, BotGotLatestTweet);
//
// function BotGotLatestTweet(error, data, response) {
//     if (error || data.statuses.length <= 0) {
//         console.log('Bot could not find latest tweet, : ' + error);
//     }
//     else {
//         let tweet = data.statuses[0];
//         let id = {
//             id: data.statuses[0].id_str
//         };
//         let retweetUser = data.statuses[0].user;
//         Bot.post('statuses/retweet/:id', id, BotRetweeted);
//
//         //get info on one single tweet
//         // Bot.get('statuses/show/:id',{id:'822928111453007872'},function(err,data,res){
//         // 	console.log(data)
//         // });
//
//         function BotRetweeted(error, response) {
//             if (error) {
//                 console.log('Bot could not retweet and already answered, : ' + error);
//             }
//             else {
//                 // if(tweet.place)
//                 // 	Bot.get('geo/id/:id',{id:tweet.place.id},function(err,data,res){
//                 // 		console.log(data.bounding_box.coordinates);
//                 // 	})
//                 lgProcessor.queryProduct(tweet.text, function (err, products) {
//                     let arrayOfKeyword = products;
//                     yellowPAPI.search(arrayOfKeyword[0], {long: -73.553, lat: 45.087}, function (err, results) {
//                         let response = results[0].title + ' at ' + results[0].address + '.' + ' Their Website is ' + results[0].url;
//                         Bot.post('statuses/update', {status: '@' + retweetUser.screen_name + ' ' + response}, function (err, data, response) {
//                             console.log('Bot retweeted : ' + id.id);
//                             console.log('Bot answered :' + retweetUser.id_str);
//                         });
//                     });
//                 });
//
//
//             }
//         }
//     }
// }
/* Set an interval of 10 minutes (in microsecondes) */
/*
 setInterval(BotRetweet, 10*60*1000);
 */
