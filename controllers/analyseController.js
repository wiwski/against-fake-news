const siteChecker = require('../services/siteChecker');
const sentiment = require("../sentiment.js");
const relatedArticles = require("../relatedArticles.js");
const satirical = require('../services/satirical');

module.exports = {
    post: post
};

function post(req, res) {

    const url = req.body.url;

    let isSatirical = satirical.isSatirical(url);
    let totalScore = Math.random()*100

    Promise.all([
        sentiment.getSentimentPromise(req.body.url),
        relatedArticles.getRelated(req.body.url),
        siteChecker.getResult(url)
    ]).then(results => {
        console.log(results)
	console.log("HEEEERE    /n")
       	console.log(results[1][0])
        return res.render('analysis', {
            sentiment: JSON.stringify(results[0]),
            articles: JSON.stringify(results[1]),
            result: JSON.stringify(results[2]),
            isSatirical: JSON.stringify(isSatirical),
	    totalScore: totalScore
        });
    }).catch((err) => {
        console.log("Error, the error is", err)
    });

}
