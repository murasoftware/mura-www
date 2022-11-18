
export default async (req, res) => {

    const result=await fetch(`${process.env.rootpath}/_api/rest/v1/default/?method=siteExists&siteid=${encodeURIComponent(req.query.siteid)}`,{
        method:'post',
        headers:{
            'Authorization':'Basic ' + Buffer.from('admin:admin').toString('base64'),
        }
    });

    const siteExists=await result.json();

    res.send(siteExists);
   
}