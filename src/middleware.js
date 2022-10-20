import { NextResponse } from 'next/server'

export function middleware(request) {

    const corePaths=['404','admin','core','plugins','icons','api','images'];
    request.nextUrl.searchParams.get('mura_upc') === 'false'

    if(!request.nextUrl.pathname.includes('.') && !request.nextUrl.pathname.startsWith("/_") && !corePaths.includes(request.nextUrl.pathname.split('/')[1])){
       
        const MURA_OCS = request.nextUrl.searchParams.get('mura_upc') || request.cookies.get('MURA_UPC');
        const MURA_UPC = request.nextUrl.searchParams.get('mura_ocs') || request.cookies.get('MURA_OCS');
    
        if(MURA_OCS || MURA_UPC === 'false' || request.nextUrl.searchParams.get('purgeCache')==='true'){
            return NextResponse.rewrite(new URL(`/_dynamic${request.nextUrl.pathname}`, request.url))
        } else {
            return NextResponse.rewrite(new URL(`/_static${request.nextUrl.pathname}`, request.url))
        }
    }

}