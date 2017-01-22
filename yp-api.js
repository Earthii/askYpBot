/**
 * Created by Nathan on 2017-01-21.
 */
var request = require('request');

class ypAPI {

    search(query, geo, callback) {
        request({
            url: "http://hackaton.ypcloud.io/search",
            method: "POST",
            json: true,
            body: {
                "search": [{
                    "searchType": "PROXIMITY",
                    "collection": "MERCHANT",
                    "what": query,
                    "where": {
                        "type": "GEO",
                        "value": geo.long + "," + geo.lat
                    }
                }]
            }
        }, function (error, response, body) {
            let merchants = body.searchResult[0].merchants;
            let results = [];
            for (let i = 0; i < merchants.length; i++) {
                let url = '';
                for(let j = 0; j < merchants[i].urls.length; j++){
                    if(merchants[i].urls[j].type == 'YPCA_MERCHANT_PAGE'){
                        url = merchants[i].urls[j];
                        break;
                    }
                }
                results.push({
                    id: merchants[i].id,
                    title: merchants[i].businessName,
                    address: merchants[i].address.displayLine,
                    url: url
                });
            }
            callback(error, results);
        });

    }
}

module.exports = ypAPI;
//
// new ypAPI().search('shoes', {long: -73.578915, lat: 45.495291}, function (err, results) {
//    console.log(results);
// });