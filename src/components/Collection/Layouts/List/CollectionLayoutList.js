import { useState } from "react";
import React from 'react';
import ReactMarkdown from "react-markdown";
import CollectionNav from '../../../CollectionNav/CollectionNav';
import ItemDate from '../../../Utilities/ItemDate';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
/*
  The link component throws an error when rerending after being 
  reconfigured in edit mode. Hence CollectionLink
*/
const List = ({props,collection,link}) => {
  const [pos, setPos] = useState(0);
  return (
    <>
      <CurrentItems collection={collection} pos={pos} link={link} {...props} /> 
      
      <div className="row">
        <div className="col-12">
        <CollectionNav collection={collection} pos={pos} setPos={setPos} link={link} {...props} />
        </div>
      </div>
    </>
  )
}

const CurrentItems = (props) => {
  const {collection,nextn,link,pos,fields} = props;
  let itemsList = [];
  let item = '';
  const Link = link;
  const items = collection.get('items');
  const itemsTo = pos+nextn > items.length ? items.length : pos+nextn;
  const fieldlist = fields ? fields.toLowerCase().split(",") : [];
  // console.log(fieldlist);

  for(let i = pos;i < itemsTo;i++) {
    item = items[i];
    console.log(item);

    itemsList.push(
      <div className="row mb-3" key={item.get('contentid')}>
      <div className="col-12 col-md-3 mb-3 pr-md-0">
      <img
        src={item.get('images').medium}
        alt={item.get('title')}
        className="img-fluid"
      />
      </div>
      <div className="col-12 col-md-9 py-3">
        <div className="mura-item-meta">
        {
            fieldlist.map(field => {
              switch(field) {
                case "title":
                  return (
                    <h5 key={item.get('field')}>{item.get('title')}</h5>
                  )
                case "date":
                    return (
                      <div className="mura-item-meta__date" key="date">
                        <ItemDate releasedate={item.get('releasedate')} lastupdate={item.get('lastupdate')}></ItemDate>
                      </div>
                    );
                case "summary":
                  return <ReactMarkdown source={item.get('summary')} key={field} />
                case "readmore":
                      return (
                        <div className="mura-item-meta__readmore" key={field}>
                          <Link href={`/${item.get('filename')}`} passHref className="btn btn-link pl-0">Read More  <FontAwesomeIcon icon={faChevronRight} /></Link>
                        </div>
                      )
                default:
                  return <div className={`mura-item-meta__${field}`} key={field} data-value={item.get(field)}>{item.get(field)}</div>
              }        
            })
        }
        </div>
      </div>
      </div>
    );
  }

  return itemsList;
}

/*
  This is not required; it is used to retrieve the required fields when populated getStatic/getServerSide props
*/
export const getQueryProps = () => {
  const data = {};
  data['fields'] = "title,summary";

  return data;
};

export default List;