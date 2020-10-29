// next.config.js
const withTM = require('next-transpile-modules')(
  ['mura.js'],
  {resolveSymlinks:true}
); // pass the modules you would like to see transpiled

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withTM(
    withBundleAnalyzer(
        {
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
