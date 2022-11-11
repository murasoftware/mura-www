const fs = require("fs");
const crypto = require("crypto");
const https = require('https');
const http = require('http');
const zlib = require("zlib");

const APPRELOADKEY = process.env.PROXY_ORIGIN_APPRELOADKEY || 'appreload';
const STALE_WHILE_REVALIDATE=process.env.PROXY_STALE_WHILE_REVALIDATE || 1;
const MAX_AGE=process.env.PROXY_MAX_AGE || 0;
const CACHE_DIR=process.env.CACHE_DIR || '/tmp';
const ORIGIN=process.env.PROXY_ORIGIN || 'localhost';
const ORIGIN_PORT=process.env.PROXY_ORIGIN_PORT || '80';
const MAX_ERRORS=process.env.PROXY_MAX_ERRORS || 100;
const HEALTH_CHECK=process.env.PROXY_HEALTH_CHECK || 60;
const HEALTH_CHECK_SAMPLE=process.env.PROXY_HEALTH_CHECK_SAMPLE || 10;
const MURA_CACHE_LOCATION = process.env.PROXY_LOCATION || "Edge"
const MURA_CACHE_REGION = process.env.PROXY_REGION || ""

const querystring = require('querystring');

let InMemoryCache={};
let ErrorCount=0;
let OriginDownTime=0;

//This could be parsed from the request in the future
const ROOTPATH=((ORIGIN_PORT==443) ? 'https://' : 'http://') + ORIGIN + ":" + ORIGIN_PORT

const fakeFetch= function(url, options , data='') { 
    return new Promise(function(resolve, reject) {
    
        const urlObj=new URL(url);

        options.host=urlObj.hostname;
        options.port=urlObj.port;
        options.path=urlObj.pathname + urlObj.search;
        options.encoding= null;

        const protocolMethod=(urlObj.protocol == 'https:') ? https : http;

        protocolMethod.gzip = true;

        protocolMethod.request(options, (res) => {
            let data = [];
            
            res.on('data', (chunk) => {
                data.push(chunk);
            });
            
            // Ending the response 
            res.on('end', () => {
                const { statusCode, headers } = res
                let validResponse = statusCode >= 200 && statusCode <= 399
                let body = Buffer.concat(data);
                
                if(headers['content-encoding'] && headers['content-encoding'].indexOf('gzip') > -1){
                    body = zlib.gunzipSync(body).toString('utf8');
                    delete headers['content-encoding'];
                    delete headers['transfer-encoding'];
                }
                
                if(typeof body != 'string'){
                    body=body.toString('utf8');
                }
               
                if (validResponse) {
                    resolve({ statusCode, headers, body })
                } else {
                    reject(new Error(`Request failed. status: ${statusCode}, body: ${body}`))
                }
            });
            
        }).on("error", (err) => {
            console.log("Error: ", err)
        }).end()
    })
}

/* 
    IMPORTANT HEADERS
    if not provided they will be automatically derived from host header
    -----------------------------------------------------
    x-forwarded-host
    x-forwarded-port
    x-forwarded-proto
*/
function isEmptyObject(obj) {
	return (typeof obj != 'object' || Object.keys(obj).length == 0);
}

const hashCode=(s)=>{
	return crypto.createHash('md5').update(s).digest("hex");
}

const isStale=(lastUpdated)=>{
    const now = new Date();
    var secsAgo = new Date(now - (STALE_WHILE_REVALIDATE * 1000));
    return (secsAgo > lastUpdated);
};

const isMaxAge=(lastUpdated)=>{
    if(!MAX_AGE){
        return false;
    } else {
        const now = new Date();
        const secsAgo = new Date(now - (MAX_AGE * 1000));
        return (secsAgo > lastUpdated);
    }
};

const isHealthy=()=>{
    if(!OriginDownTime){
        return true;
    } else if(OriginDownTime < new Date(new Date() - (HEALTH_CHECK * 1000))){
        ErrorCount=ErrorCount-HEALTH_CHECK_SAMPLE;
        OriginDownTime=0;
        return true;
    }  else {
        return false;
    }
};

const checkForError=(res)=>{
    if(res && (res.statusCode >=500 || res.statusCode == 408)){
        ErrorCount++;
    } else if (ErrorCount) {
        ErrorCount--;
    }
    if(ErrorCount === MAX_ERRORS){
        OriginDownTime=new Date();
    }
};

const parseRequest=(req)=>{
    let siteid='default';
    let parsedURL='';
    let nextIsSiteiD=false;
    const urlParts=req.url.split('?');
   
    urlParts[0].split('/').forEach(function (item) {
            if (item) {
                parsedURL = parsedURL + '/' + item;
                if (nextIsSiteiD) {
                    siteid = item;
                }
                if (item === 'v1') {
                    nextIsSiteiD = true;
                } else {
                    nextIsSiteiD = false;
                }
            }
        });
    
    const sortedParams = {};
    const sortedKeyParams = {};

    if(urlParts.length >1){
        let params = {};
        
        if(urlParts.length){
            params = querystring.parse(urlParts[1].toLowerCase());
        }

        if(!params.mura_ocs && req.cookies['MURA_OCS']){
            params.mura_ocs=req.cookies['MURA_OCS']
        }

        if(!params.mura_upc && (!req.cookies['MURA_UPC'] || req.cookies['MURA_UPC']==='false')){
            params.mura_upc=req.cookies['MURA_UPC']
        }
       
        const transparentQueryParams=['mura_upc','purgecache','cachekey','cachedwithin','cacheid','_cacheid'];
        
        Object.keys(params).sort().forEach(key => {
            //Don't forward cache buster variables
            if(!transparentQueryParams.includes(key)){
                sortedKeyParams[key] = params[key];
            } 
             sortedParams[key] = params[key];
        })
            
    } else {
        if(req.cookies['MURA_OCS']){
            sortedParams.mura_ocs=req.cookies['MURA_OCS']
        }

        if((!req.cookies['MURA_UPC'] || req.cookies['MURA_UPC']==='false')){
            sortedParams.mura_upc=req.cookies['MURA_UPC']
        }
    }
   
    let cachekey=parsedURL;

    if(Object.keys(sortedKeyParams).length){
        cachekey += `?${querystring.stringify(sortedKeyParams)}`;
    }
    cachekey='m' + hashCode(cachekey);

    if(Object.keys(sortedParams).length){
        parsedURL += `?${querystring.stringify(sortedParams)}`;
    }

    let cacheable=true;

    if(sortedParams.mura_upc==='false'){
        cacheable=false;
    }

    const args={
        method: req.method.toLowerCase(),
        headers: req.headers
    }
   
    if(req.method!='get' && req.body ){
        args.body=req.body;
    }
   
    return {
        siteid:siteid,
        url:ROOTPATH + parsedURL,
        cachekey:cachekey,
        cacheable: cacheable,
        fetchArgs:args,
        params:sortedParams
    };
};

const parseHeaders=(headers)=>{
    const restricted={
        "connection":true,
        "expect":true,
        "keep-alive":true,
        "proxy-authenticate":true,
        "proxy-Authorization":true,
        "proxy-connection":true,
        "trailer":true,
        "upgrade":true,
        "x-accel-buffering":true,
        "x-accel-charset":true,
        "x-accel-limit-rate":true,
        "x-accel-redirect":true,
        "x-amz-cf-*":true,
        "x-amzn-auth":true,
        "x-amzn-cf-billing":true,
        "x-amzn-cf-id":true,
        "x-Amzn-cf-xff":true,
        "x-amzn-errortype":true,
        "x-amzn-fle-profile":true,
        "x-amzn-header-count":true,
        "x-amzn-header-order":true,
        "x-amzn-lambda-integration-tag":true,
        "x-amzn-requestId":true,
        "x-cache":true,
        "x-edge-*":true,
        "x-forwarded-proto":true,
        "x-real-ip":true,
        "transfer-encoding":true,
        "content-length":true,
        "accept-encoding":true, 
        "if-modified-since":true,  
        "if-none-match":true,    
        "if-range":true,
        "if-unmodified-since":true,
        "via":true
    };

    const encoding = headers['content-encoding'];

    if(Array.isArray(encoding)){
        headers['content-encoding']=headers['content-encoding'].filter((h)=>{
            return (h != 'gzip');
        });
    }
    
    const filteredHeaders={};

    Object.keys(headers).forEach((key)=>{
        if(!restricted[key]){
            filteredHeaders[key]=headers[key];
        }
    });

    return filteredHeaders;
};

const handleResponse=async (result)=>{
    const body= result.body;
    let data='';
    try {
        data = JSON.parse.call(null,body);
    } catch (e) {
        data = body;
    }
    return data;
}

const doRequest=(req, res) =>{
    return new Promise(async function(success,failure){
        res.removeHeader('Transfer-Encoding');
        const reqProps=parseRequest(req);
    
        sendHeaders(req);

        const proxiedResponse=await fakeFetch(reqProps.url, reqProps.fetchArgs);
        
        res.proxiedHeaders=parseHeaders(proxiedResponse.headers);
        
        success(await handleResponse(proxiedResponse));
    }); 
};

const doRequestSync=async (req, res) =>{
    const reqProps=parseRequest(req);

    sendHeaders(req);

    res.setHeader("x-mura-cache-role",'origin');
    res.setHeader("x-mura-cache-region",MURA_CACHE_REGION);
    
    let result={};
    let proxiedResponse={};

    try{
        proxiedResponse=await fakeFetch(reqProps.url, reqProps.fetchArgs);
       
        result=await handleResponse(proxiedResponse);
        
        console.log('initial result',result);

        const headers = parseHeaders(proxiedResponse.headers);
        Object.keys(headers).forEach((header)=>{
            res.setHeader(header,headers[header]);
        });
        res.removeHeader("Transfer-Encoding");
        res.statusCode=proxiedResponse.statusCode  || res.statusCode;
        res.proxiedHeaders=headers;
       // console.log(res.proxiedResponse.headers)
        checkForError(proxiedResponse);
        
        return result;
    } catch(e){
        console.log('error in initial get',e);
        try{
            const headers=parseHeaders(proxiedResponse.headers);
            Object.keys(headers).forEach((header)=>{
                res.setHeader(header,headers[header]);
            });
            res.removeHeader("Transfer-Encoding");
            res.statusCode=proxiedResponse.statusCode || res.statusCode;
            checkForError(proxiedResponse);
            res.proxiedHeaders=headers;
            if(typeof e != 'object'){
                const check=JSON.parse(e);
                return check;
            } else {
                return e;
            }
        } catch(e2){
            return e;
        }
    }
};

const sendHeaders=(req)=>{
    if(req.headers){
        const headers=req.headers;
        
        const host = headers.host;

        if(host){
            const hostArray=host.split(":");
            const portCheck=(hostArray.length >1) ? hostArray[1] : 0;
           
            if(!headers['x-forwarded-host'] ){
                headers['x-forwarded-host']=host;
            }
           
            if(!headers['x-forwarded-port'] && portCheck){
                headers['x-forwarded-port']=portCheck;
            }
        }
        if(!headers['x-forwarded-proto']){
            headers['x-forwarded-proto']='https';
        }
        //console.log('sendHeaders',req.headers);
    }
};

const getStoredRequest=(requestKey)=>{
    let storedRequest={};

    if(typeof InMemoryCache[requestKey] != 'undefined'){
        storedRequest=InMemoryCache[requestKey];
    } else {
        let fileLoc=`${CACHE_DIR}/cache/${requestKey}.json`;
        if (fs.existsSync(fileLoc)) {
            try{
                storedRequest=JSON.parse(fs.readFileSync(fileLoc));
                storedRequest.created=new Date(storedRequest.created);
            } catch(e){
                console.log(e);
            }
        }
    }
    
    console.log('storedRequest',storedRequest);

    return storedRequest;
};

const storeRequest=(res,result,requestKey)=>{
    let headers={};
    
    if(res.statusCode == 200){
        if(res.proxiedHeaders){
            headers=Object.assign({},res.proxiedHeaders);
        }
       
        delete headers['set-cookie'];

        const storedRequest={
            headers:headers,
            statusCode:res.statusCode,
            data:result,
            created: new Date()
        };

        InMemoryCache[requestKey]=storedRequest;

        if (!fs.existsSync(`${CACHE_DIR}/cache`,)){
            fs.mkdirSync(`${CACHE_DIR}/cache`,);
        }
        
        fs.writeFile(`${CACHE_DIR}/cache/${requestKey}.json`,
            JSON.stringify(storedRequest) , 
            (err) => {
            if (err) throw err;
        });
    }   
};
 
const doCache = (res)=> {
    console.log('res in docache',res);
    let CacheControl=res.proxiedHeaders['cache-control'] || res.proxiedHeaders['Cache-Control'];
   
    if(!Array.isArray(CacheControl)){
        CacheControl=[CacheControl]; 
    }

    //If cache controls says to not cache or store it or it's private, don't add to cache
    CacheControl.forEach((item)=>{
        if(item){
            item.split(',').forEach((val)=>{
                if(val){
                    const header=val.trim().toLowerCase();
                    if(!(!header 
                            || header != 'no-cache="set-sookie"' 
                            || !(header.indexOf('no-cache') > -1 
                                || header.indexOf('no-store') > -1 
                                || header.indexOf('private') > -1
                                )
                            )
                        ){
                        return false;
                    }
                }
            });
        }
    });

    //If the request returns a new Output Cache State, don't cache it
    let SetCookie=res.proxiedHeaders['set-cookie'] || res.proxiedHeaders['Set-Cookie'];
    
    if(SetCookie){
        if(!Array.isArray(SetCookie)){
            SetCookie=[SetCookie]; 
        }
        
        /* 
            This is to make sure that the consumer's
            context has not changed from the original
            start of the request. If it has, we don't cache
        */
        SetCookie.forEach((item)=>{
            if(item){
                if(typeof item == 'string'){
                    item.split(',').forEach((val)=>{
                        if(val){
                            const header=val.trim().toLowerCase();
                            if(header.indexOf('mura_ocs') > 1){
                                return false;
                            }
                        }
                    });
                } else {
                    console.log('cookie is not string',item)
                }
            }
        });
    }
  
    return true;
};

const get= async (req, res) => {
    if(req.url=='/purge'){
        fs.rm('cache', { recursive: true }, (err) => {
            if (err) {
                throw err;
            }  
            console.log('the cache has been deleted');
        });
        InMemoryCache={};
        return {
            data:"success"
        };
    }
  
    const reqProps=parseRequest(req);
   
    res.setHeader("x-mura-cache-role",'origin');
    res.setHeader("x-mura-cache-region",MURA_CACHE_REGION);

    //console.log('reqProps',reqProps,reqProps.params.mura_upc);
    // console.log('isHealthy',isHealthy());
    if(isHealthy() && (
            reqProps.params.mura_upc==='false' 
            || reqProps.params.mura_upc ==='false' 
            || reqProps.params.csrf_token
            || reqProps.params.purgecache==='true'
            || typeof reqProps.params[APPRELOADKEY] != 'undefined'
            || typeof reqProps.params.changesetid != 'undefined'
            || reqProps.params.method ==='processAsyncObject'
            || reqProps.params.method ==='findTrackingProperties'
            || reqProps.url.indexOf('permissions') > -1
            || reqProps.url.indexOf('new') > -1
        )
    ){  
        //console.log('doRequestSync');
        res.removeHeader("Transfer-Encoding");
        const result=await doRequestSync(req, res);
        return result;
    } else {
        const requestKey=reqProps.cachekey;
        const storedRequest=getStoredRequest(requestKey);
        
        if(storedRequest.created){
            //console.log('Exists in cache');
            if(isHealthy()){
                if(isMaxAge(storedRequest.created)){
                    let result=await doRequestSync(req, res);  
                
                    if(reqProps.cacheable && doCache(res)){
                        storeRequest(res,result,requestKey);
                    }
                    return result;
                } else if(isStale(storedRequest.created)){
                    doRequest(req, res).then((newresult)=>{
                        if(reqProps.cacheable && doCache(res)){
                            storeRequest(res,newresult,requestKey);
                        }
                    });  
                }
            }
            Object.keys(storedRequest.headers).forEach((header)=>{
                res.setHeader(header,storedRequest.headers[header]);
            });

            res.removeHeader("Transfer-Encoding");
            res.setHeader("x-mura-cache-role",MURA_CACHE_LOCATION);
            res.setHeader("x-mura-cache-region",MURA_CACHE_REGION)
       
            res.statusCode=storedRequest.statusCode;
            return storedRequest.data;
        } else if (isHealthy()) {
            try{
                let result=await doRequestSync(req, res);  
              
                if(reqProps.cacheable && doCache(res)){
                    storeRequest(res,result,requestKey);
                }
                return result;
            } catch(e1){
                console.log('Level 2 error occurred',e1);
                try{
                    if(typeof e1 != 'object'){
                        const check=JSON.parse(e1);
                        return check;
                    } else {
                        return e;
                    }
                } catch(e2){
                    console.log('Level 3 error occurred',e2);
                    return e1;
                }
            }
        } else {
            res.statusCode=503;
            return {
                error:"503 Service Unavailable"
            };
        }
           
    }
};

const defaultHandler= async (req, res) => {
    const result=await doRequestSync(req, res);
    return result;
};

const eventToRequest=(event)=>{
    if(event?.Records){
        const request = {
            headers:{},
            method:event.Records[0].cf.request.method,
            host:'',
            cookies:{},
            url:event.Records[0].cf.request.uri + ((event.Records[0].cf.request.querystring) ? '?' + event.Records[0].cf.request.querystring : ''),
        };


        for (const [key, value] of Object.entries(event.Records[0].cf.request.headers)) {
            request.headers[key.toLowerCase()]=value[0].value;
        }

        if(!request.headers.host || !request.headers.host.indexOf('amazonaws') > -1){
            request.headers.host=ORIGIN + ((ORIGIN_PORT != 80) ? ':' + ORIGIN_PORT : '');
        }

        request.host=(Array.isArray(request.headers.host)) ? request.headers.host[0] : request.headers.host;
        
        if(request.headers.cookie){
            const cookieHeader=(Array.isArray(request.headers.cookie)) ? request.headers.cookie[0] : request.headers.cookie;
            cookieHeader.split(";").forEach((c)=>{
                if(c){
                    const valArray=c.split("=");
                    if(valArray.length){
                        const name=valArray[0];
                        request.cookies[name.trim()]=(valArray.length >1) ? valArray[1] : '';
                    }
                }
            })

        }

        if(event.Records[0].cf.request?.body?.data){
            request.body=event.Records[0].cf.request.body.data;
        }

        return request;
        
    } else {
        event.headers = event.headers || {};
        event.multiValueHeaders = event.multiValueHeaders || {};
        event.multiValueQueryStringParameters = event.multiValueQueryStringParameters || {}

        const cookies={};
        const rawHeaders=Object.assign({},event.multiValueHeaders,event.headers);
        const headers= {};

        Object.keys(rawHeaders).forEach(h=>{
            const h_lcase=h.toLowerCase();
            headers[h_lcase]=rawHeaders[h];
            if(Array.isArray(headers[h_lcase]) && headers[h_lcase].length==1 ){
                headers[h_lcase]=headers[h_lcase][0];
            }
        });

        if(headers.cookie){
            const cookieHeader=(Array.isArray(headers.cookie)) ? headers.cookie[0] : headers.cookie;
            cookieHeader.split(";").forEach((c)=>{
                if(c){
                    const valArray=c.split("=");
                    if(valArray.length){
                        const name=valArray[0];
                        cookies[name.trim()]=(valArray.length >1) ? valArray[1] : '';
                    }
                }
            })
        }
        
        if(!headers.host || !headers.host.indexOf('amazonaws') > -1){
            headers.host=ORIGIN + ((ORIGIN_PORT != 80) ? ':' + ORIGIN_PORT : '');
        }

        return {
            host:(Array.isArray(headers.host)) ? headers.host[0] : headers.host,
            body:event.Body,
            method:event.httpMethod,
            headers : headers,
            cookies : cookies,
            url: event.path + ((isEmptyObject(event.multiValueQueryStringParameters)) ? '' : "?" + Object.keys(event.multiValueQueryStringParameters).map(k=>k + '=' + event.multiValueQueryStringParameters[k].join(','))),
        };
    }
}

const eventToResponse=()=>{
    return {
        headers:{},
        removeHeader:function(header){delete this.headers[header];},
        statusCode:200,
        setHeader:function(header,value){
            this.headers[header]=value; 
        }
    };
}

exports.handler = async function(event, context, callback){
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    const isAtEdge=(event?.Records);
    
    console.log('event',event)
   
    const req=eventToRequest(event);
    const res=eventToResponse(event);

    //console.log('req',req);
    //console.log('res',res);
    console.log('isAtEdge',isAtEdge);

    let result={};

    if(isAtEdge){
        try{
            if(req.method.toLowerCase()==='get'){
                result=await get(req,res);
            } else {
                result=await defaultHandler(req,res);
            }
        }  catch(e){
            console.log('error getting request',e);
            result=JSON.stringify(e);

            const response = {
                status: '500',
                statusDescription: 'ERROR',
                headers: res.headers,
                body: result,
            };

            callback(null, response);
        }

        const multiValueHeaders={
            'content-type':[
                {
                    key:'content-type',
                    value:'application/json;charset=utf-8'
                }
            ]
        };
    
        Object.keys(res.headers).forEach(h=>{
            let c;

            if(Array.isArray(res.headers[h])){
                c=res.headers[h][0];  
            } else {
                c=res.headers[h];
            }

            multiValueHeaders[h]=[{
                key: h,
                value: c
            }];
        });
        
        delete multiValueHeaders['transfer-encoding'];
        delete multiValueHeaders['content-length'];

        if(typeof result != 'string'){
            result=JSON.stringify(result);
        }

        //console.log('result',result);
        console.log('multiValueHeaders',multiValueHeaders);
        const response = {
            status: res.statusCode,
            statusDescription: 'OK',
            headers: multiValueHeaders,
            body: result
        };
        //console.log('response',response);
        callback(null, response);

    } else {

        try{
            if(req.method.toLowerCase()==='get'){
                result=await get(req,res);
            } else {
                result=await defaultHandler(req,res);
            }
        }  catch(e){
            console.log(e);
            result=JSON.stringify(e);

            return {
                statusCode: 500,
                multiValueHeaders:{},
                body: result
            }; 
        }

        if(typeof result != 'string'){
            result=JSON.stringify(result);
        }

        const multiValueHeaders={'content-type':['application/json;charset=utf-8']};
    
        Object.keys(res.headers).forEach(h=>{
            if(Array.isArray(res.headers[h])){
                multiValueHeaders[h]=res.headers[h];  
            } else {
                multiValueHeaders[h]=[res.headers[h]];
            }
        });
        
        delete multiValueHeaders['transfer-encoding'];

        return {
            statusCode: res.statusCode,
            multiValueHeaders:multiValueHeaders,
            body: result
        };
    }
}
exports.default = async (req, res) => {

    let result={};
    // try{
        if(req.method==='GET'){
            result=await get(req,res);
        } else {
            result=await defaultHandler(req,res);
        }
       

       //console.log(res)
    // }  catch(e){
    //     console.log(e);
    //     result=JSON.stringify(e);
    //     res.send(result);
    // }
    //console.log( result)
    res.send(result);
}