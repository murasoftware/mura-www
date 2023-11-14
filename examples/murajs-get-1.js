import muraConfig from 'mura.config.js';
import { setMuraConfig ,getMura} from '@murasoftware/next-core';

export default async (req, res) => {
    setMuraConfig(muraConfig);

	const Mura = getMura({  
        response:res,
        request:req,
        siteid:req.query.siteid
    })

    const result = await Mura.post(
        Mura.getAPIEndpoint() + `?method=siteExists&siteid=${encodeURIComponent(req.query.siteid)}`,
        {
            headers:{
                myheader:'myheadervalue'
            },
            cache:'no-store',
            /*
            If getting a Mura module's dynamic props
        
            next:{ revalidate: 10 }
            */
        }
    );
        
	res.send(result);
}
