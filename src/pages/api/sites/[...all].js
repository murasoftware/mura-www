import httpProxyMiddleware from "next-http-proxy-middleware";
const proxyTarget = process.env.MURA_ROOTPATH;

export const config = {
	api: {
		// Enable `externalResolver` option in Next.js
		externalResolver: true,
		cookieDomainRewrite: true,
	},
};

export default (req, res) =>
	httpProxyMiddleware(req, res, {
		target: proxyTarget,
		// To proxy a request to Mura add the path to the below array, as well as adding an appropriate rewrite in next.config.js
		pathRewrite: [
			{
				patternStr: "^/api/sites",
				replaceStr: "/sites",
			}
		],
	});
