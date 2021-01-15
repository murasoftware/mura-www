import React from 'react';
import ItemDate from '@mura/react/UI/Utilities/ItemDate';
import Badge from 'react-bootstrap/Badge';
import ItemCategories from '@mura/react/UI/Utilities/ItemCategories';

function ArticleMeta(props){
    const fields = props.fields;
    const fieldlist = fields ? fields.toLowerCase().split(",") : [];
    const item = props.content;
    // const catAssignments = item.getAll().categoryassignments;
    console.log(item);
    return (
        <div className="pb-4">
            {
                fieldlist.map(field => {
                    switch(field) {
                    case "date":
                        return (
                            <div className="mura-item-meta__date" key="date">
                            <ItemDate releasedate={props.content.releasedate} lastupdate={props.content.lastupdate}></ItemDate>
                            </div>
                        );
                    case "credits":
                        return (
                            <OutputCredits credits={props.content.credits} key="credits"></OutputCredits>
                        );
                    case "tags":
                        return (
                            <OutputTags tags={props.content.tags} key="tags"></OutputTags>
                        );
                    default:
                        return <div className={`mura-item-meta__${field}`} key={field} data-value={props.content[field]}>{props.content[field]}</div>
                    }
                })
            }
            {item.categoryid &&
                
                    <span className="badge">Categories would go here.</span>
            }

                {/* <ItemCategories categories={catAssignments} /> */}
        </div>
    )
}

//can be used to format tags specifically or create a component for sitewide usage like ItemDate
const OutputTags = (props) => {
    const Tags = props.tags.split(',');;
    let tagList = [];
    let tag = '';
    // console.log(props.tags);
    for(let i = 0;i < Tags.length;i++) {
        tag = Tags[i];
        tagList.push(
            <Badge variant="primary mr-2">{tag}</Badge>
        )
    }

    return tagList;
}
//can be used to format credits specifically or create a component for sitewide usage like ItemDate
const OutputCredits = (props) => {
    const Credits = props.credits.split(',');
    let creditsList = [];
    let credit = '';
    // console.log(props.tags);
    for(let i = 0;i < Credits.length;i++) {
        credit = Credits[i];
        creditsList.push(
            <div className="mura-item-meta__credits pb-2">
                By: <strong>{credit}</strong>
            </div>
        )
    }

    return creditsList;    
    
}

export default ArticleMeta;