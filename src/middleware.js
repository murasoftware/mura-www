import { NextResponse } from 'next/server'

export function middleware(request) {
    
    const corePaths=['404','admin','core','plugins','icons','api','images'];
    let path=request.nextUrl.pathname;
    
    if(!path.includes('.') && !path.startsWith("/_") && !corePaths.includes(path.split('/')[1])){
        const urlSearchParams = new URLSearchParams(request.nextUrl.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        const MURA_OCS = params.mura_upc || request.cookies.get('MURA_UPC');
        const MURA_UPC = params.mura_ocs || request.cookies.get('MURA_OCS');

        if(MURA_OCS || MURA_UPC === 'false' || params.purgeCache==='true'){
            return NextResponse.rewrite(new URL(`/_dynamic${path}${request.nextUrl.search}`, request.url))
        } else {
            return NextResponse.rewrite(new URL(`/_static${path}${request.nextUrl.search}`, request.url))
        }
    }

}