import React,{useState,useEffect} from 'react';
import Mura from 'mura.js';
import Link from "next/link";
import ComponentRegistry from 'mura.config';
import {getHref} from '@mura/react/MuraConnector';

const getLayout=(layout) => {
    console.log('getLayout!' + layout);
    const uselayout = layout == 'default' ? "DefaultLayout" : layout;
  
    if(typeof ComponentRegistry[uselayout] != 'undefined') {
      return ComponentRegistry[uselayout];
    } else {
      console.log("Layout not registered: ",layout);
      return ComponentRegistry['DefaultLayout'];
    }
}

function ResourceHub(props) {
    // console.log('ResourceHub!' + JSON.stringify(props));
    const objectparams = Object.assign({}, props);
    console.log(JSON.stringify(objectparams, replacerFunc()));
    const DynamicCollectionLayout = getLayout('Cards').component;

    if(!objectparams.dynamicProps){
        const [collection,setCollection]=useState(false);
        useEffect(() => {
            getDynamicProps(objectparams).then((dynamicProps)=>{
                setCollection(new Mura.EntityCollection(dynamicProps.collection,Mura._requestcontext));
            });   

        }, []);

        if(collection) {
            return (
                <DynamicCollectionLayout collection={collection} props={props} link={RouterlessLink}/>
            )
        }
        else {
            return (
                <div></div>
            )
        }
    } else {
        const collection=new Mura.EntityCollection(objectparams.dynamicProps.collection,Mura._requestcontext);
        console.log('items: ' + collection);
        return (
            <DynamicCollectionLayout collection={collection} props={props} link={RouterLink}/>
        )
    }
}

const RouterlessLink = ({href,children,className})=>{
    return (
        <a href={getHref(href)} className={className}>
            {children}
        </a>
    );
}
  
const RouterLink = ({href,children,className})=>{
    return (
        <Link href={getHref(href)}>
            <a className={className}>{children}</a>
        </Link>
    );
}

export const getDynamicProps = async props => {  
    const collection=await Mura.getFeed('content')
        .where()
        .prop('type').isIn('Page,Link,File')
        .andProp('path').containsValue(props.content.contentid)
        .getQuery();
        console.log('collection: ' + collection);


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
      items:collection.getAll().items
    };
}

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

export default ResourceHub;