import httpProxyMiddleware from 'next-http-proxy-middleware';
import muraConfig from 'mura.config';

export const config = {
    api: {
      // Enable `externalResolver` option in Next.js
      externalResolver: true
    },
  }
  
  export default (req, res) => (
     httpProxyMiddleware(req, res, {
        // You can use the `http-proxy` option
        target: muraConfig.ConnectorConfig.rootpath,
        // In addition, you can use the `pathRewrite` option provided by `next-http-proxy-middleware`
        pathRewrite: [{
           patternStr: '^/api/sites',
          replaceStr: '/sites'
         }]
      })
  );