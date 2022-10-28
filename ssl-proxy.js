//./server-local.js
require('dotenv').config();

const httpProxy = require("http-proxy");
var fs = require('fs');

const key = process.env.LOCAL_KEY || 'certs/localhost-key.pem';
const cert = process.env.LOCAL_CERT || 'certs/localhost.pem';
const port = process.env.SSL_PORT || 443;

const proxy=httpProxy.createServer({
  xfwd: true,
  ws: true,
  target: "http://localhost:3000",
  ssl: {
    key: fs.readFileSync(key, "utf8"),
    cert: fs.readFileSync(cert, "utf8")
  }
})

proxy.on("error", function(e) {
  console.log(e);
})

proxy.listen(port);



