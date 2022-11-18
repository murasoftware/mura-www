import { NextResponse } from 'next/server'

export async function middleware(request) {
    
    const corePaths=['404','admin','core','plugins','icons','api','images'];
    let path=request.nextUrl.pathname;
    
    if(!path.includes('.') && !path.startsWith("/_") && !corePaths.includes(path.split('/')[1])){
        let tenantPath="";

        const params = Object.fromEntries(new URLSearchParams(request.nextUrl.search).entries());

        if(process.env.multitenant){
            global.siteidmap=global.siteidmap || {};
            const domain=request.headers.get('x-forwarded-host') || request.headers.get('host');
            
            if(!global.siteidmap[domain] || params.bindtodomain){
                let siteMap=await fetch(`${process.env.rootpath}/_api/json/v1/default?method=findSiteid`,{
                    method:'get',
                    headers:{
                        'x-forwarded-host':request.headers.get('x-forwarded-host') || request.headers.get('host'),
                        'cookie':request.headers.get('cookie')
                    },
                    next: { revalidate: 10 }
                });
    
                //try{
                    siteMap=await siteMap.json();
                //} catch(e){
                //     console.log(e)
                //     siteMap={data:'default'};
                // }
                global.siteidmap[domain]=siteMap.data;
            }
           
            
            let siteid= global.siteidmap[domain];
            
            if(!siteid){
                if(!Array.isArray(ConnectorConfig.siteid)){
                    siteid=siteid.split(',')[0];
                } else {
                    siteid=ConnectorConfig.siteid;
                }
            }

            siteid=siteid || 'default';

            request.headers.get('x-mura-siteid',siteid);

            tenantPath=`/${siteid}`;
        }

        
        const MURA_OCS = params.mura_upc || request.cookies.get('MURA_UPC');
        const MURA_UPC = params.mura_ocs || request.cookies.get('MURA_OCS');

        if(MURA_OCS || MURA_UPC === 'false' || params.purgeCache==='true'){
            return NextResponse.rewrite(new URL(`/_dynamic${tenantPath}${path}${request.nextUrl.search}`, request.url))
        } else {
            return NextResponse.rewrite(new URL(`/_static${tenantPath}${path}${request.nextUrl.search}`, request.url))
        }
    }

}