import React from 'react';
import OutputMarkup from "@mura/react/UI/Utilities/OutputMarkup";
import DisplayRegion from '@mura/react/UI/DisplayRegion';
import ArticleMeta from '@mura/react/UI/ArticleMeta';

function Article({content,moduleStyleData,header,footer,displayregions}){
    return(
        <>
        {/* Article Header */}
        {content && displayregions && header &&
            <DisplayRegion
            region={header}
            moduleStyleData={moduleStyleData}
            content={content}
            />
        }

        {/* Article Image */}
        <div className="container-fluid px-0">
            <img src={content.images.hero} className="img-fluid w-100" />
        </div>

        {/* Article Meta */}
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-9">
                    <ArticleMeta content={content} fields="Title,Summary,Date,Credits,Tags" />
                </div>
            </div>
        </div>

        {/* Article Body */}
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-9">
                    <h1>{content.title}</h1>
                    <OutputMarkup source={content.body} />
                </div>
            </div>
        </div>

        {/* Article Footer */}
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