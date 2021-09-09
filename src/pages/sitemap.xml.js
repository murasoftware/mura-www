import React from "react";
import { setMuraConfig, getMuraPaths, getSiteName } from '@murasoftware/next-core';
import Mura from 'mura.js';
import muraConfig from 'mura.config';

const Sitemap = () => {};

export async function getServerSideProps({ res }) {
    setMuraConfig(muraConfig);

	var response = '';

	try {
		response = await Mura.get(Mura.rootpath + "/sitemap.xml");
	}
	catch(e) {
		response = '<error>not found</error>';
	}

	res.setHeader("Content-Type", "text/xml");
	res.write(response);
	res.end();

	return {
		props: {},
	};
};

export default Sitemap;



