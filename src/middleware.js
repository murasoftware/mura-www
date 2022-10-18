import { NextResponse } from "next/server";

export function middleware(req) {
  let { pathname } = req.nextUrl
  const rootpath=['mura.config.json','edit','sites','assets','ico','api','_api','_next'];
  const pathArray=pathname.split("/");

  pathArray.shift();

  if(!pathArray[0].startsWith("_") && !rootpath.includes(pathArray[0])){
    if(req.cookies.get('MURA_UPC')==='false'){
      return NextResponse.rewrite(new URL('/_dynamic' + pathname, req.url));
    } else {
      return NextResponse.rewrite(new URL('/_static' + pathname, req.url));
    }
  }

}