import muraConfig from 'mura.config';
import { setMuraConfig ,getMura} from '@murasoftware/next-core';

export default async (req, res) => {
    setMuraConfig(muraConfig);

	const Mura = getMura({  
        response:res,
        request:req,
        siteid:req.query.siteid
    })

    const result = await Mura.get(
        Mura.getAPIEndpoint() + 'path/to/endpoint', 
        {
            mypostvar1: 'myvalue1',
            mypostvar2: 'myvalue2'
        },
        {
            headers:{
                myheader:'myheadervalue'
            },
            cache:'no-store',
            /*
            If getting a Mura module's dynamic props
        
            next:{ revalidate: 10 }
            
            */
        },
        /*
        next:{ revalidate: 10 }
        cache:'no-store'
        */
    );
        
	res.send(result);
}
