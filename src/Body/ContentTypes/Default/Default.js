import React from 'react';
import DisplayRegion from '@mura/react/UI/DisplayRegion';

function Default({content,moduleStyleData,header,primarycontent,footer,displayregions}){
    return(
        <>
        {content && displayregions && header &&
            <DisplayRegion
            region={header}
            moduleStyleData={moduleStyleData}
            content={content}
            />
        }
        {content && displayregions && primarycontent &&
            <DisplayRegion
            region={primarycontent}
            moduleStyleData={moduleStyleData}
            content={content}
            />
        }
        {content && displayregions && footer &&
            <DisplayRegion
            region={footer}
            moduleStyleData={moduleStyleData}
            content={content}
            />
        }
        </>
    )
}

export default Default;