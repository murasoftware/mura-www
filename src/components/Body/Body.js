import React from 'react';
import Article from './ContentTypes/Article';
import Default from './ContentTypes/Default';
function Body({content,moduleStyleData,header,primarycontent,footer,displayregions}){
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

