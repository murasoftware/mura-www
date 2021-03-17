import React from 'react';
import { DisplayRegion } from '@murasoftware/next-core';
import { muraConfig } from 'mura.config';

function Default({content,moduleStyleData,header,primarycontent,footer,displayregions}){
    return(
        <>
        {content && displayregions && header &&
            <DisplayRegion
            region={header}
            moduleStyleData={moduleStyleData}
            content={content}
            muraConfig={muraConfig}
            />
        }
        {content && displayregions && primarycontent &&
            <DisplayRegion
            region={primarycontent}
            moduleStyleData={moduleStyleData}
            content={content}
            muraConfig={muraConfig}
            />
        }
        {content && displayregions && footer &&
            <DisplayRegion
            region={footer}
            moduleStyleData={moduleStyleData}
            content={content}
            muraConfig={muraConfig}
            />
        }
        </>
    )
}

export default Default;