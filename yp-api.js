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
            console.log(body)
            let merchants = body.searchResult[0].merchants;
            let results = [];
            for (let i = 0; i < merchants.length; i++) {
                results.push({
                    id: merchants[i].id,
                    title: merchants[i].businessName,
                    address: merchants[i].address.displayLine,
                    url: merchants[i].urls[0].text
                });
            }
            callback(error, results);
            console.log(JSON.stringify(results), null, 2);
        });

    }
}

module.exports = ypAPI;