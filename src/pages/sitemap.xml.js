import React from "react";
import { setMuraConfig, getMura } from '@murasoftware/next-core';
import muraConfig from 'mura.config';

const Sitemap = () => {};

export async function getServerSideProps({ res }) {
    setMuraConfig(muraConfig);
	const Mura = getMura();
	let response = '';

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



