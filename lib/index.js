let express  = require('express');
let proxy  = require('express-http-proxy');
let cors  = require('cors');
let url  = require('url');

let app = express();
let port = process.env.CR_PORT || 8080;
let token = process.env.CR_TOKEN;

if (!token) {
    console.log('Please specify a CR_TOKEN env variable');
    process.exit(1);
}

app.use(cors());
app.use(proxy('https://api.clashroyale.com/v1/', {
    filter: function (req, res) {
        return req.method == 'GET';
    },
    proxyReqPathResolver: function (req, res) {
        return url.parse(req.url).path;
    },
    proxyReqOptDecorator: function (req) {
        req.headers['Authorization'] = `Bearer ${token}`;
        return req;
    }
}));

app.listen(port, function (err) {
    if (err) {
        throw err;
    }

    console.log(`CR proxy listening on port ${port}`);
});