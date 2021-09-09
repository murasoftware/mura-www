import React from "react";
import { setMuraConfig } from '@murasoftware/next-core';
import Mura from 'mura.js';
import muraConfig from 'mura.config';

const Sitemap = () => {};

export async function getServerSideProps({ res }) {
    setMuraConfig(muraConfig);

	var response = '';

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



