import React,{useState,useEffect} from 'react';
import Mura from 'mura.js';

import ReactMarkdown from "react-markdown";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ItemDate from '@mura/react/UI/Utilities/ItemDate';

function ResourceHub(props) {

  const objectparams = Object.assign({}, props);
  const thisTitle = 'Resource Hub';

  const updateFilter = (e) => {
    console.log('hi');
    let subtype = '';
    let categoryid = '';
    let personaid = '';
  
    switch(e.target.name) {
      case 'subtype':
        subtype = e.target.value;
        // setSubtypes = e.target.value;
        break
      case 'categoryid':
        categoryid = e.target.value;
        break
      case 'personaid':
        personaid = e.target.value;
        break
  }
  
    getFilterProps(subtype,categoryid,personaid).then((filterProps) => {
      getCollection(props,filterProps).then((collection) => {
        setCollection(collection);
      })
    });
  }

  let _collection = false;
  if(objectparams.dynamicProps){
    _collection=new Mura.EntityCollection(objectparams.dynamicProps.collection,Mura._requestcontext);
  }
  
  const [collection,setCollection]=useState(_collection);
  
  // const [resourcefilters,setResourceFilters]=useState();

  if(!objectparams.dynamicProps){    

    useEffect(() => {
      getDynamicProps(objectparams).then((dynamicProps)=>{

        setCollection(new Mura.EntityCollection(dynamicProps.collection,Mura._requestcontext));
        //setResourceFilters(dynamicProps.resourcefilters);
        // console.log(dynamicProps.resourcefilters);

      });
    }, []);



    if(collection) {
      return (
        <div>
          <h1>Dynamic {thisTitle}</h1>

          <RenderFilterForm updateFilter={updateFilter} {...props} />

          {/* <Collection collection={collection} {...props} layout="List" /> */}

          <div className="row collectionLayoutCards row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-3">

            <CurrentItems collection={collection} {...props} /> 

          </div>
        </div>
      )
    }
    else {
      return (
       <div><h1>Empty {thisTitle}</h1></div>
      )
    }
  } else {
      return (
        <div>
          <h1>Static {thisTitle}</h1>
          <RenderFilterForm updateFilter={updateFilter} {...props} />
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

    itemsList.push(
    <div className="col mb-4" key={item.get('contentid')}>
      <Card className="mb-3 h-100 shadow">
         <Card.Img variant="top" src={item.get('images')['landscape']} key={item.get('fileid')} />

        <Card.Body>
          <div className="mura-item-meta">
              <Card.Text key="subtype" className="badge badge-danger">{item.get('subtype')}</Card.Text>
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
  const filterProps = await getFilterProps('','','');
  const collection = await getCollection(props,filterProps);
  return{
    collection:collection.getAll(),
    filterprops:filterProps
  }
  return {}
}

const getCollection = async (props,filterProps) => {
  if(typeof props.content.getAll != 'undefined'){
      props.content=props.content.getAll();
  }
  
  const excludeIDList=props.content.contentid;

  const feed = Mura.getFeed('content');

      feed.prop('type').isIn('Page,Link,File');
      feed.andProp('path').containsValue(props.content.contentid);
      feed.andProp('contentid').isNotIn(excludeIDList);
      feed.expand('categoryassignments');

      if(filterProps.subtype.length){
        feed.andProp('subtype').isEQ(filterProps.subtype);
      }
      if(filterProps.categoryid.length){
        feed.andProp('categoryid').isIn(filterProps.categoryid);
        feed.setUseCategoryIntersect(true);
      }
      if(filterProps.personaid.length){
        feed.sort('mxpRelevance');
      }

      feed.maxItems(props.maxitems);
      feed.itemsPerPage(0); 
      
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

  const collection = await feed.getQuery();

  return collection;
}

const getFilterProps = async (subtype,categoryid,personaid) => {
  const Subtype = subtype;
  const Categoryid = categoryid;
  const Personaid = personaid;

  const filterProps = await Mura.getEntity('resourcehub').invoke('processFilterArgs',{subtype:Subtype, categoryid:Categoryid, personaid:Personaid});

  //ISSUE: filterprops do not "clear" when a blank value is passed to them, they maintain their previously set value when returned from resourcehub api -- add logic to resourcehub api or other solution?

  //POSSIBLE SOLUTION: "All" selections could have an "All" value and update the api to account for this (if form.categoryid = "All" then categoryid = "")

  //QUESITON: can we put these into the main dynamicProps and have them available always, then this method just updates them when a seleciton is made?
  console.log('filterProps: ' + JSON.stringify(filterProps,undefined,2));
  return filterProps;
}

const RenderFilterForm = (props) => {
  const subtypesArray = [
    {
      key: 'whitepaper',
      text: 'White Paper',
      value: 'whitepaper',
    },
    {
      key: 'webinar',
      text: 'Webinar',
      value: 'webinar',
    },
    {
      key: 'article',
      text: 'Article',
      value: 'article',
    }
  ]

  const categoriesArray = [
    {
      key: 'developers',
      text: 'Developers',
      value: '7EC9592C-719A-4745-B017ED8B6223178F',
    },
    {
      key: 'itprofessionals',
      text: 'IT Professionals',
      value: 'C501C4E8-429E-408D-94721ADC3BA56E9F',
    },
    {
      key: 'marketers',
      text: 'Marketers',
      value: '38212296-E460-4883-A1C83D49E3DAC901',
    }
  ]
  const personasArray = [
    {
      key: 'persona1',
      text: 'Persona 1',
      value: 'persona1-id',
    },
    {
      key: 'persona2',
      text: 'Persona 2',
      value: 'persona2-id',
    }
  ]
  
  

  return (
    <Form className="row row-cols-3">
      <Form.Group controlId="selectSubtypes" className="col">
        <Form.Label>Subtypes:</Form.Label>
        <Form.Control as="select" name="subtype" custom onChange={ props.updateFilter }>
        <option value="*" key="All Subtypes">All Subtypes</option>
        {subtypesArray.map(option => (
          <option value={option.value} key={option.key}>{option.text}</option>
        ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="selectCategories" className="col">
      <Form.Label>Categories:</Form.Label>
        <Form.Control as="select" name="categoryid" custom onChange={ props.updateFilter }>
          <option value="*" key="All Categories">All Categories</option>
          {categoriesArray.map(option => (
            <option value={option.value} key={option.key}>{option.text}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="selectPersonas" className="col">
      <Form.Label>Personas:</Form.Label>
        <Form.Control as="select" name="personaid" custom 
          onChange={ props.updateFilter }>
          <option value="*" key="All Personas">All Personas</option>
          {personasArray.map(option => (
            <option value={option.value} key={option.key}>{option.text}</option>
          ))}
        </Form.Control>
      </Form.Group>
    </Form>
  );
}

export default ResourceHub;