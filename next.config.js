// next.config.js

const withTM = require('next-transpile-modules')(
  ['mura.js'],
  {resolveSymlinks:true}
); // pass the modules you would like to see transpiled

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const handleBooleanProperty=function(variable){
  return typeof variable != 'undefined' && !(((variable === '0') || (variable === 'false')));
}

module.exports = withTM(
    {
      async redirects() {
        return []
      },
      future: {
        webpack5: true
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
        htmleditortype: typeof process.env.MURA_HTMLEDITORTYPE != 'undefined' ? process.env.MURA_HTMLEDITORTYPE : 'markdown'
      }
    },
    withBundleAnalyzer(
        {
        enabled: 'true',
        trailingSlash: true,
        exportPathMap: async function(
          defaultPathMap,
          { dev, dir, outDir, distDir, buildId },
        ) {

          let newPathMap = {...defaultPathMap};
          delete newPathMap['/edit/[...page]'];
          return newPathMap;
        },
      }
    )
  );
