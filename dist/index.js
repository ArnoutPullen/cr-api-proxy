'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHttpProxy = require('express-http-proxy');

var _expressHttpProxy2 = _interopRequireDefault(_expressHttpProxy);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.CR_PORT || 8080;
var token = process.env.CR_TOKEN;

if (!token) {
    console.log('Please specify a CR_TOKEN env variable');
    process.exit(1);
}

app.use((0, _cors2.default)());
app.use((0, _expressHttpProxy2.default)('https://api.clashroyale.com/v1/', {
    filter: function filter(req, res) {
        return req.method == 'GET';
    },
    proxyReqPathResolver: function proxyReqPathResolver(req, res) {
        return _url2.default.parse(req.url).path;
    },
    proxyReqOptDecorator: function proxyReqOptDecorator(proxyReqOpts, srcReq) {
        proxyReqOpts.headers['Authorization'] = 'Bearer ' + token;
        return proxyReqOpts;
    }
}));

app.listen(port, function (err) {
    if (err) {
        throw err;
    }

    console.log('CR proxy listening on port ' + port);
});