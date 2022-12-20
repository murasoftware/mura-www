import { NextResponse } from 'next/server'

export async function middleware(request) {

    const getSiteIdMap=async(request, domain)=>{
        let siteMap=await fetch(`${process.env.rootpath}/_api/json/v1/default?method=findSiteid&domain=${domain.split(':')[0]}`,{
            method:'get',
            headers:{
                'x-forwarded-host':domain,
                'cookie':request.headers.get('cookie')
            }
        });
        
        try{
            siteMap=await siteMap.json();
        } catch(e){
            console.log('Error parsing json', e)
            siteMap={
                data:''
            };
        }
    
        global.siteidmap[domain]={
            siteid:siteMap.data,
            time:Date.now()
        }
    
        return  global.siteidmap[domain];
    }
    
    try {
        const corePaths=['404','admin','core','plugins','icons','api','images'];
        let path=request.nextUrl.pathname;
      
        if(!path.includes('.') && !path.startsWith("/_") && !corePaths.includes(path.split('/')[1])){
            let tenantPath="";
          
            const params = Object.fromEntries(new URLSearchParams(request.nextUrl.search).entries());

            if(process.env.multitenant){
                global.siteidmap=global.siteidmap || {};
                const domain=request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost';
              
                if(domain && (!global.siteidmap[domain] || params.bindtodomain)){
                    await getSiteIdMap(request, domain);
                } else if(((Date.now() - global.siteidmap[domain].time) > 1000)){
                    getSiteIdMap(request, domain);
                }
               
                let siteid= (domain && global.siteidmap[domain].siteid) ? global.siteidmap[domain].siteid : '';
                
                if(!siteid){
                    console.log('missing siteid for domain',domain.split(":")[0]);
                }

                siteid=siteid || 'default';

                request.headers.get('x-mura-siteid',siteid);

                tenantPath=`/${siteid}`;
            }
   
            const MURA_OCS = params.mura_ocs || request.cookies.get('MURA_OCS')?.value;
            const MURA_UPC = params.mura_upc || request.cookies.get('MURA_UPC')?.value;

            let adjustedPath=`${tenantPath}${path}`;
            
            //remove trailing slash
            adjustedPath=adjustedPath.replace(/\/+$/, '');
            
            if(MURA_OCS || MURA_UPC === 'false' || params.purgeCache==='true'){
                return NextResponse.rewrite(new URL(`/_dynamic${adjustedPath}${request.nextUrl.search}`, request.url))
            } else {
                return NextResponse.rewrite(new URL(`/_static${adjustedPath}${request.nextUrl.search}`, request.url))
            }
        }
    } catch(e){
        console.log(e);
    }

}