let AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');

class NathanProcessor{
    constructor(){
        this.watson = new AlchemyLanguageV1({
            api_key: '836929e582b56ff138ef55896dc5efb959fdd50b'
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
            callback(err, keywords);
        });
    }
    queryLocation(string, callback){

    }
}

/**
 *  Example Code
 *
 *  new NathanProcessor().queryProduct('Where can I find nike shoes?', function (err, keywords) {
 *       console.log(keywords);
 *  };
*/