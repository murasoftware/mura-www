import React from 'react';
import { DisplayRegion } from '@murasoftware/next-core';
import { muraConfig } from 'mura.config';
import Loading from '@components/Loading/Loading';

function Default({content,moduleStyleData,header,primarycontent,footer,displayregions,queryParams, Mura}){
    
    return(
        <>
        {content && displayregions && header &&
            <DisplayRegion
            region={header}
            moduleStyleData={moduleStyleData}
            content={content}
            muraConfig={muraConfig}
            queryParams={queryParams}
            Mura={Mura}
            />
        }
        {content && displayregions && primarycontent &&
            <DisplayRegion
            region={primarycontent}
            moduleStyleData={moduleStyleData}
            content={content}
            muraConfig={muraConfig}
            queryParams={queryParams}
            Mura={Mura}
            />
        }
        {content && displayregions && !primarycontent &&
            <Loading />
        } 
        {content && displayregions && footer &&
            <DisplayRegion
            region={footer}
            moduleStyleData={moduleStyleData}
            content={content}
            muraConfig={muraConfig}
            queryParams={queryParams}
            Mura={Mura}
            />
        }
        </>
    )
}

export default Default;