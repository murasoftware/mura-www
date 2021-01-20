import React from 'react';
import DisplayRegion from '@mura/react/UI/DisplayRegion';
import Article from '../Body/ContentTypes/Article';
import Default from '../Body/ContentTypes/Default';
function Body({content,moduleStyleData,header,primarycontent,footer,displayregions}){
    console.log(content);
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
    );
        
}

export default Body;

