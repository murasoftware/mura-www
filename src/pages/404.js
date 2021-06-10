import { useRouter } from "next/router"
import ErrorPage from 'next/error';
import { useEffect, useState } from "react"
import muraConfig from 'mura.config';
import Mura from 'mura.js';


export default function FourOhFour(props) {
    const router = useRouter()
    const [checkingRedirect,setCheckingRedirect]=useState(true);
    useEffect(() => {
        if(location.pathname.startsWith("//")){
            router.replace(location.pathname.substring(1));
        } else {
            const connectorConfig=Object.assign({content:{}},muraConfig.ConnectorConfig);
            console.log(connectorConfig)
            Mura.init(connectorConfig);
            Mura.getCurrentUser().then(function(user){
                if(user.isSystemUser()){
                    if(Mura.siteidinurls){
                        router.replace(`/${Mura.siteid}/404edit`); 
                    } else {
                        router.replace('/404edit');
                    }
                } else {
                    setCheckingRedirect(false);
                }
            })
        }
    },[])

    if(checkingRedirect){
        return <ErrorPage statusCode="404" title="Checking for redirect."/>
    } else {
        return <ErrorPage statusCode="404" />
    }
   
}