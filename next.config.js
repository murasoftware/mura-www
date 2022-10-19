// next.config.js
/*
Handy snippet if you can't find where a log entry is coming from

['log', 'warn','error'].forEach(function(method) {
  var old = console[method];
  console[method] = function() {
    var stack = (new Error()).stack.split(/\n/);
    // Chrome includes a single "Error" line, FF doesn't.
    if (stack[0].indexOf('Error') === 0) {
      stack = stack.slice(1);
    }
    var args = [].slice.apply(arguments).concat([stack[1].trim()]);
    return old.apply(console, args);
  };
});

*/
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const handleBooleanProperty=function(variable){
  return typeof variable != 'undefined' && !(((variable === '0') || (variable === 'false')));
}

module.exports = withBundleAnalyzer(
    {
      async headers() {
        return [
          {
            source: '/:path*',
            headers: [
              {
                key: 'X-Frame-Options',
                value: 'sameorigin',
              }
            ],
          },
          {
            source: '/',
            headers: [
              {
                key: 'X-Frame-Options',
                value: 'sameorigin',
              }
            ],
          }
        ]
      },
      async rewrites() {
        return [
          {
            source: '/sites/:path*',
            destination: '/api/sites/:path*'
          }
        ]
      },
      eslint: {
        // Warning: Dangerously allow production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      },
      env: {
        rootpath: typeof process.env.MURA_ROOTPATH != 'undefined' ? process.env.MURA_ROOTPATH : 'http://localhost:8888',
        siteid: process.env.MURA_SITEID || ['default'],
        editroute: '',
        sitename: typeof process.env.MURA_SITENAME != 'undefined' ? process.env.MURA_SITENAME :'Example Site',
        siteidinurls:  handleBooleanProperty(process.env.MURA_SITEIDINURLS),
        codeblocks: handleBooleanProperty(process.env.MURA_CODEBLOCKS),
        variations: handleBooleanProperty(process.env.MURA_VARIATIONS),
        MXP: handleBooleanProperty(process.env.MURA_MXP),
        MXPTracking: typeof process.env.MURA_MXPTRACKING != 'undefined' ? process.env.MURA_MXPTRACKING : 'native',
        htmleditortype: typeof process.env.MURA_HTMLEDITORTYPE != 'undefined' ? process.env.MURA_HTMLEDITORTYPE : 'markdown'
      },
      enabled: 'true',
        //trailingSlash: true,
        exportPathMap: async function(
          defaultPathMap,
          { dev, dir, outDir, distDir, buildId },
        ) {

          let newPathMap = {...defaultPathMap};
          delete newPathMap['/edit/[...page]'];
          return newPathMap;
        }
    }
  );
