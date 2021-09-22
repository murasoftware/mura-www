import React from "react";
import { setMuraConfig, getMura } from '@murasoftware/next-core';
import muraConfig from 'mura.config';

const Sitemap = () => {};

export async function getServerSideProps({ res }) {
    setMuraConfig(muraConfig);
	const Mura = getMura();
	let response = '';

	try {
		response = await Mura.get(Mura.rootpath + "/robots.txt");
	}
	catch(e) {
		response = 'User-agent: *';
	}

	res.setHeader("Content-Type", "text/plain");
	res.write(response);
	res.end();

	return {
		props: {},
	};
};

export default Sitemap;



