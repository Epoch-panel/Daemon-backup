/*
Genesis - Holaclient-E Daemon
This code shall not be distributed publicly
Made by Demon
*/
const qs = require('querystring');

function parser(req, res, next) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        if (req.headers['content-type'] === 'application/json') {
            try {
                req.body = JSON.parse(body);
            } catch (err) {
                return res.statusCode = 400, res.end('Invalid JSON');
            }
        } else if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
            req.body = qs.parse(body);
        }
        next();
    });
}

module.exports = parser;
