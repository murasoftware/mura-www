import React,{useState,useEffect} from 'react';
import Mura from 'mura.js';
import Collection from '@mura/react/UI/Collection';

import ReactMarkdown from "react-markdown";
import Card from 'react-bootstrap/Card';
import CollectionNav from '@mura/react/UI/CollectionNav/CollectionNav';
import ItemDate from '@mura/react/UI/Utilities/ItemDate';
import CollectionReadMoreBtn from '@mura/react/UI/Utilities/CollectionReadMoreBtn';



function ResourceHub(props) {
  const objectparams = Object.assign({}, props);
  const thisTitle = 'Resource Hub';
  if(!objectparams.dynamicProps){
    const [collection,setCollection]=useState(false);

    useEffect(() => {
      getDynamicProps(objectparams).then((dynamicProps)=>{
        setCollection(new Mura.EntityCollection(dynamicProps.collection,Mura._requestcontext));
      });
    }, []);

    if(collection) {
      //console.log(collection);
      return (
        <div>
          <h1>Dynamic {thisTitle}</h1>
          {/* <Collection collection={collection} layout="List" /> */}
        </div>
      )
    }
    else {
      return (
       <div><h1>Empty {thisTitle}</h1></div>
      )
    }
  } else {
    const collection=new Mura.EntityCollection(objectparams.dynamicProps.collection,Mura._requestcontext);
    //console.log(collection);
      return (
        <div>
          <h1>Static {thisTitle}</h1>
          {/* <Collection collection={collection} layout="List" /> */}
          <div className="row collectionLayoutCards row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-3">
            <CurrentItems collection={collection} {...props} /> 
          </div>
        </div>
      )
  }
}

const CurrentItems = (props) => {
  const {collection,nextn,link,pos,fields} = props;
  let itemsList = [];
  let item = '';
  const Link = link;
  const items = collection.get('items');
  let itemsTo = items.length;
  let catAssignments = [];

  for(let i = 0;i < itemsTo;i++) {
    item = items[i];
    catAssignments = item.getAll().categoryassignments;
    //console.log(catAssignments)
    itemsList.push(
    <div className="col mb-4" key={item.get('contentid')}>
      <Card className="mb-3 h-100 shadow">
         <Card.Img variant="top" src={item.get('images')['landscape']} key={item.get('fileid')} />

        <Card.Body>
          <div className="mura-item-meta">
              <Card.Text key="categories"><CurrentCats categories={catAssignments} /></Card.Text>
              <Card.Title key="title">{item.get('title')}</Card.Title>
              <div className="mura-item-meta__date" key="date">
              <ItemDate releasedate={item.get('releasedate')} lastupdate={item.get('lastupdate')}></ItemDate>
              </div>
              <ReactMarkdown source={item.get('summary')} key="summary" />
          </div>
        </Card.Body>

      </Card>
    </div>
    );
  }

  return itemsList;
}

const CurrentCats = (props) => {
  const Categories = props.categories;
  //console.log(Categories);
  let catsList = [];
  let cat = '';
  const cats = Categories.items;
  let catsTo = cats.length;
  
  if (cats.length){
      for(let i = 0;i < catsTo;i++) {
      cat = cats[i];
      catsList.push(
        <span key={cat.categoryid}>{cat.categoryname}</span>
      )
    }
    return catsList;
  }
  return 'No Categories';
}

export const getDynamicProps = async props => {
    if(typeof props.content.getAll != 'undefined'){
        props.content=props.content.getAll();
    }

    const filterProps = await getFilterProps();//stopping dynamicProps from finishing?
    console.log('filterprops: ' + JSON.stringify(filterProps, undefined, 2));

    const excludeIDList=props.content.contentid;

    const collection=await Mura.getFeed('content')
        .where()
        .prop('type').isIn('Page,Link,File')
        .andProp('path').containsValue(props.content.contentid)
        .andProp('contentid').isNotIn(excludeIDList)
        .expand('categoryassignments')
        .getQuery();
        // console.log('all items: ' + JSON.stringify(collection.getAll().items, undefined, 2));

        //.setMaxItems(props.maxitems);
    
        // if(len(props.subtypes)){
        //     collection.andProp('subtype').isIn(props.subtypes);
        // }

        // if(len(excludeIDList)){
        //     collection.andProp('contentid').isNotIn(excludeIDList)
        // }
        
        // if(len(session.resourceFiltler.subtype) && listFindNoCase(props.subtypes,session.resourceFiltler.subtype)){
        //     collection.andProp('subtype').isEQ(session.resourceFiltler.subtype);
        // }

        // if(hasMXP && len(session.resourceFiltler.personaid)){
        //     collection.sort('mxpRelevance');
        // }

        // if(listLen(session.resourceFiltler.categoryid)){
        //     collection.andProp('categoryid').isIn(session.resourceFiltler.categoryid);
        //     collection.setUseCategoryIntersect(true);
        // }

        // if(hasMXP && len(session.resourceFiltler.personaid) && listFindNoCase(props.personaids,session.resourceFiltler.personaid)){
        //     form.personaid=session.resourceFiltler.personaid;
        //     collection.setSortBy('mxpRelevance');
        // } else {
        //     collection.setSortBy('releaseDate');
        //     collection.setSortDirection('desc');
        // }

        
        
    return {
      collection:collection.getAll()
    };
}

const getFilterProps = async props => {
  const filterProps = await Mura.getEntity('resourcehub').invoke('processFilterArgs',{})
  .then(function(result) {
    //console.log(result); // "initResolve"
    return result;
  });
  // console.log('filterprops: ' + filterProps);
  // console.log('hasfilter: ' + filterProps.hasfilter);
  // console.log('subtype: ' + filterProps.subtype);
  // console.log('categoryid: ' + filterProps.categoryid);
  // console.log('personaid: ' + filterProps.personaid);
  return filterProps;
}

//for debugging only
const replacerFunc = () => {
    const visited = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (visited.has(value)) {
          return;
        }
        visited.add(value);
      }
      return value;
    };
  };
//for debugging only

export default ResourceHub;