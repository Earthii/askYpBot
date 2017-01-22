let AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');

class NathanProcessor{
    constructor(api_key){
        this.watson = new AlchemyLanguageV1({
            api_key: api_key
        });
    }
    queryProduct(string, callback){
        this.watson.keywords({
            text: string
        }, function (err, res) {
            let keywords = [];
            for(let i = 0; i < 3 && i < res.keywords.length; i++){
                keywords.push(res.keywords[i].text);
            }
            console.log(keywords)
            callback(err, keywords);
        });
    }
    queryLocation(string, callback){
        this.watson.entities({
            text: string
        }, function (err, res) {
            if (res.entities.length > 0 && res.entities[0].type == 'City'){
                callback(err, res.entities[0].text)
            } else {
                callback(err, null);
            }
        });
    }
}

module.exports = NathanProcessor;

/**
 *  Example Code
 *
 *  new NathanProcessor().queryProduct('Where can I find nike shoes?', function (err, keywords) {
 *       console.log(keywords);
 *  };
*/