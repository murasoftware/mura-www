import React, { useEffect, useState} from 'react';
import Article from './ContentTypes/Article';
import Default from './ContentTypes/Default';
import ErrorPage from 'next/error';

function Body({content,moduleStyleData,header,primarycontent,footer,displayregions,queryParams,Mura}){
    
    const [bodyRegion,setBodyRegion]=useState(primarycontent);
    let  isOnDisplay = content.isondisplay;

    useEffect(() => {
        if(primarycontent){
            setBodyRegion(primarycontent);
        } else {
            Mura.renderFilename(content.filename,{displayregions:'primarycontent'}).then(function(rendered){
                content.body=rendered.get('body');
                isOnDisplay=rendered.get('isondisplay');
                setBodyRegion(rendered.get('displayregions').primarycontent);
            });
        }
    }, [content.contenthistid]);

    // console.log('content.isondisplay: ', content.isondisplay);
    if(typeof isOnDisplay == 'undefined' || isOnDisplay == 1){
        switch(content.subtype){
            case 'Article':
            case 'Blog Post':
            return (
                <Article
                    content={content}
                    moduleStyleData={moduleStyleData}
                    header={header}
                    footer={footer}
                    primarycontent={bodyRegion}
                    displayregions={displayregions}
                    queryParams={queryParams}
                    Mura={Mura}
                />
            )
        }

        return (
            <Default
                content={content}
                moduleStyleData={moduleStyleData}
                header={header}
                primarycontent={bodyRegion}
                footer={footer}
                displayregions={displayregions}
                queryParams={queryParams}
                Mura={Mura}
            />
        )
    } else {
        return (
            <ErrorPage statusCode="404"/>
        )
    }//isondisplay
        
}

export default Body;

