import muraConfig from 'mura.config';
import { setMuraConfig ,getMura} from '@murasoftware/next-core';

export default async (req, res) => {
    setMuraConfig(muraConfig);

	const Mura = getMura({  
        response:res,
        request:req,
        siteid:req.query.siteid
    })

    const result = await Mura.getFeed('content')
        .where().prop('title').containsValue('test')
        .getQuery({
            cache:'no-store',
            /*
            If getting a Mura module's dynamic props
        
            next:{ revalidate: 10 }
            
            */
        });
        
	res.send(result.getAll());
}