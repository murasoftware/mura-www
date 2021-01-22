import React from 'react';
import ItemDate from '@mura/react/UI/Utilities/ItemDate';
import ItemCredits from '@mura/react/UI/Utilities/ItemCredits';
import ItemTags from '@mura/react/UI/Utilities/ItemTags';

function ArticleMeta(props){
    console.log('fields ArticleMeta: ' + props.fields);
    const fields = props.fields ? props.fields : 'Date,Credits,Tags';
    const fieldlist = fields ? fields.toLowerCase().split(",") : [];
    const item = props.content;
    return (
        <div className="pb-4">
            {
                fieldlist.map(field => {
                    switch(field) {
                    case "date":
                        return (
                            <div className="mura-item-meta__date" key="date">
                            <ItemDate releasedate={item.releasedate} lastupdate={item.lastupdate}></ItemDate>
                            </div>
                        );
                    case "credits":
                        return (
                            <ItemCredits credits={item.credits} key="credits" />
                        );
                    case "tags":
                        return (
                            <ItemTags tags={item.tags} key="tags" />
                        );
                    default:
                        return <div className={`mura-item-meta__${field}`} key={field} data-value={props.content[field]}>{props.content[field]}</div>
                    }
                })
            }
        </div>
    )
}

export default ArticleMeta;