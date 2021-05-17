import React from 'react';
import Article from './ContentTypes/Article';
import Default from './ContentTypes/Default';
import ErrorPage from 'next/error';

function Body({content,moduleStyleData,header,primarycontent,footer,displayregions}){
    const isOnDisplay = content.isondisplay;
    // console.log('content.isondisplay: ', content.isondisplay);
    if(isOnDisplay == 1){
        switch(content.subtype){
            case 'Article':
            case 'Blog':
            case 'Whitepaper':
            return (
                <Article
                    content={content}
                    moduleStyleData={moduleStyleData}
                    header={header}
                    footer={footer}
                    displayregions={displayregions}
                />
            )
        }
        return (
            <Default
                content={content}
                moduleStyleData={moduleStyleData}
                header={header}
                primarycontent={primarycontent}
                footer={footer}
                displayregions={displayregions}
            />
        )
    } else {
        return (
            <ErrorPage statusCode="404" />
        )
    }//isondisplay
        
}

export default Body;

