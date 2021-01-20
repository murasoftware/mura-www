import React from 'react';
import ReactMarkdown from "react-markdown";
import DisplayRegion from '@mura/react/UI/DisplayRegion';

function Article({content,moduleStyleData,header,footer,displayregions}){
    return(
        <>
        {content && displayregions && header &&
            <DisplayRegion
            region={header}
            moduleStyleData={moduleStyleData}
            content={content}
            />
        }
        <div className="container-fluid px-0">
            <img src={content.images.hero} className="img-fluid w-100" />
        </div>
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-9">
                    <h1>{content.title}</h1>
                    <ReactMarkdown source={content.body} />
                </div>
            </div>
        </div>
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

export default Article;