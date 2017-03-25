const Promise = require('bluebird');
const request = require('request');
const wotConfig = require('../config/wotConfig');

module.exports = {
    getResult: getResult,
    extractDomain: extractDomain
};

function getResult(url) {
    this.url = url;
    return new Promise((resolve) => {
        requestApi(url).then(transformData).then(resolve);
    });
};

function requestApi(url) {
    return new Promise((resolve, reject) => {
        const requestUrl = `${wotConfig.api.baseUrl}/?hosts=${url}/&key=${wotConfig.api.key}`;

        var options = {
            url: requestUrl,
            method: 'GET',
            json: true
        };

        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve({
                    url: url,
                    data: body
                });
            }
        });
    });
}

function transformData(data) {
    return new Promise((resolve) => {
        const domain = extractDomain(data.url);

        resolve({
            reputation: data.data[domain]['0'][0],
            confidence: data.data[domain]['0'][1],
            categories: data.data[domain].categories
        });
    });
}

function extractDomain(url) {
    let domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
    return domain;
}
