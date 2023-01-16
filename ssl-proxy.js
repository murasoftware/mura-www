//./server-local.js
/*
  If using docker for the Mura service 
  set MURA_PORT: 443 in the docker-compose.yml.
*/

const fs = require('fs');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');

require('dotenv').config();

const app = require('express')();
const key = process.env.LOCAL_KEY || 'certs/mura.local-key.pem';
const cert = process.env.LOCAL_CERT || 'certs/mura.local.pem';
const MURA_ROOTPATH = 'http://localhost:8888';
const NEXT_ROOTPATH = 'http://localhost:3000';


const options = {
  key: fs.readFileSync( key, 'utf8'),
  cert: fs.readFileSync( cert, 'utf8')
};

const setProxyHeaders = (proxyReq, req, res) => {
  proxyReq.setHeader('x-forwarded-host', req.hostname.split(':')[0]);
  proxyReq.setHeader('x-forwarded-proto','https');
  proxyReq.setHeader('x-forwarded-port',443);

}
const muraProxy=createProxyMiddleware( {
  target: MURA_ROOTPATH,
  changeOrigin: true,
  onProxyReq: setProxyHeaders,
  onProxyReqWs: setProxyHeaders
} );

const nextProxy=createProxyMiddleware( {
  target: NEXT_ROOTPATH,
  changeOrigin: true,
  onProxyReq: setProxyHeaders,
  onProxyReqWs: setProxyHeaders
} );

app.use(/^((?!(\/admin|\/_api|\/sites|\/plugins|\/core|\/index.cfm|\/temp)).)*$/, nextProxy)
app.use('*', muraProxy)


const httpsServer = https.createServer(options, app);

httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

