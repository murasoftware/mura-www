
export default async (req, res) => {
	const result = await fetch(
		`${process.env.rootpath}/_api/rest/v1/default/?method=siteExists&siteid=${encodeURIComponent(
			'siteidtocheck'
		)}`,
		{
			method: 'get',
			headers: {
				Cookie: req.headers.cookie
			},
            cache:'no-store',
            /*
            If getting a Mura module's dynamic props
        
            next:{ revalidate: 10 }
            */
		}
	);
	const json = await result.json();

	res.send(json);
}