import React,{useState,useEffect} from 'react';
import Mura from 'mura.js';
import Form from 'react-bootstrap/Form';
import {getLayout,RouterlessLink,RouterLink} from '@mura/react/UI/Collection';
/*
  TODO: scrollpages -- not sure if this is even working at all in collection in NextJS, should test

  TODO: send/set multiple categories -- now only latest selected is sent/set

  TODO: Sort by persona / stage
*/

function ResourceHub(props) {
  const objectparams = Object.assign({}, props);
  const DynamicCollectionLayout = getLayout(objectparams.layout).component;
  
  const thisTitle = 'Resource Hub';

  const [curSubtype, setCurSubtype]=useState('*');
  const [curCategoryId, setCurCategoryId]=useState('*');
  const [curPersonaId, setCurPersonaId]=useState('*');

  const updateFilter = (e) => {
    let subtype = '';
    let categoryid = '';
    let personaid = '';
  
    switch(e.target.name) {
      case 'subtype':
        subtype = e.target.value;
        setCurSubtype(e.target.value);
        break
      case 'categoryid':
        categoryid = e.target.value;
        setCurCategoryId(e.target.value);
        break
      case 'personaid':
        personaid = e.target.value;
        setCurPersonaId(e.target.value);
        break
  }
  
    getFilterProps(subtype,categoryid,personaid).then((filterProps) => {
      getCollection(props,filterProps).then((collection) => {
        setCollection(collection);
        setFilterProps(filterProps);
      })
    });
  }

  let _collection = false;
  if(objectparams.dynamicProps){
    _collection=new Mura.EntityCollection(objectparams.dynamicProps.collection,Mura._requestcontext);
  }
  
  const [collection,setCollection]=useState(_collection);

  let _filterprops = false;
  if(objectparams.dynamicProps){
    _filterprops=objectparams.dynamicProps.filterprops;
    console.log(objectparams.dynamicProps.filterprops);
  }
  const [filterprops,setFilterProps]=useState(_filterprops);

  if(!objectparams.dynamicProps){

    useEffect(() => {
      getDynamicProps(objectparams).then((dynamicProps)=>{
        setCollection(new Mura.EntityCollection(dynamicProps.collection,Mura._requestcontext));
        setFilterProps(dynamicProps.filterprops);
      });
    }, []);

    if(collection) {
      return (
        <div>
          <h1>Dynamic {thisTitle}</h1>

          <RenderFilterForm 
            updateFilter={updateFilter}
            {...props}
            curSubtype={filterprops.subtype}
            curCategoryId={filterprops.categoryid}
            curPersonaId={filterprops.personaid}
          />

          <DynamicCollectionLayout collection={collection} props={props} link={RouterlessLink}/>

        </div>
      )
    } else {
      return (
       <div><h1>Empty {thisTitle}</h1></div>
      )
    }
  } else {
      return (
        <div>
          <h1>SSR {thisTitle}</h1>
          <RenderFilterForm 
            updateFilter={updateFilter}
            {...props}
            curSubtype={filterprops.subtype}
            curCategoryId={filterprops.categoryid}
            curPersonaId={filterprops.personaid}
          />
          <DynamicCollectionLayout collection={collection} props={props} link={RouterLink}/>
        </div>
      )
  }
}

export const getDynamicProps = async props => {
  const filterProps = await getFilterProps('','','');
  const collection = await getCollection(props,filterProps);
  
  return{
    collection:collection.getAll(),
    filterprops:filterProps
  }
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
        feed.useCategoryIntersect(true);
      }
      if(filterProps.personaid.length){
        // feed.sort('mxpRelevance');//no such columnn tcontent.mxpRelevance
        // feed.setSortBy('mxpRelevance');//no such function .setSortBy
        // feed.sort('mxpRelevance','asc');//no such columnn tcontent.mxpRelevance
      } else {
        feed.sort('releasedate','desc');
      }

      feed.maxItems(props.maxitems);
      feed.itemsPerPage(0);

  const collection = await feed.getQuery();

  return collection;
}

const getFilterProps = async (subtype,categoryid,personaid) => {
  const Subtype = subtype;
  const Categoryid = categoryid;
  const Personaid = personaid;

  const filterProps = await Mura.getEntity('resourcehub').invoke('processFilterArgs',{subtype:Subtype, categoryid:Categoryid, personaid:Personaid});
  
  console.log('filterProps: ' + JSON.stringify(filterProps,undefined,2));
  return filterProps;
}

const RenderFilterForm = (props) => {
  const objectparams = Object.assign({}, props);
  const [categoriesArray,setCategoriesArray]=useState(false);
  const [personasArray,setPersonasArray]=useState(false);

  const subtypesArray = objectparams.subtypes ? objectparams.subtypes.split(',') : [];
  const categoryIds = objectparams.categoryids ? objectparams.categoryids.split(','): [];
  const personaIds = objectparams.personaids ? objectparams.personaids.split(','): [];
  // console.log('personas: ' + objectparams.personaids);

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    getCategoriesInfo(categoryIds).then((data)=>{
      if (isMounted) setCategoriesArray(data.items);
    });
    getPersonasInfo(personaIds).then((data)=>{
      if (isMounted) setPersonasArray(data.items);
      
    });
    return () => { isMounted = false };
  }, []);
  
  // console.log('filterprops: ' + JSON.stringify(props, replacerFunc(), 2));  
  //TO DO - persist after refresh -- useState and get value from props.objectparams.filterProps

  console.log('current subtype: ' + props.curSubtype);
  console.log('current categories: ' + props.curCategoryId);
  console.log('current personaid: ' + props.curPersonaId);
  // console.log('subtypes: ' + subtypesArray);
  // console.log('current subtype: ' + curSubtype);

  return (
    <Form className="row row-cols-3">
      {subtypesArray.length > 0 &&
      <Form.Group controlId="selectSubtypes" className="col">
        <Form.Label>Subtypes:</Form.Label>
        <Form.Control as="select" name="subtype" custom onChange={ props.updateFilter } value={props.curSubtype}>
          <option value="*" key="All Subtypes">All Subtypes</option>
          {subtypesArray.map((subtype, index) => (
            <option value={subtype} key={index}>{subtype}</option>
          ))}
        </Form.Control>
      </Form.Group>
      }
      {categoriesArray && categoriesArray.length > 0 &&
      <>
        {categoriesArray.map((category, index) => (
          <CategorySelect categoryid={category.categoryid} filterlabel={category.name} updateFilter={props.updateFilter} curCategoryId={props.curCategoryId} key={category.categoryid} />
        ))}
      </>
      }
      {personasArray.length > 0 &&
      <Form.Group controlId="selectPersonas" className="col">
      <Form.Label>Personas:</Form.Label>
        <Form.Control as="select" name="personaid" custom onChange={ props.updateFilter } value={props.curPersonaId}>
          <option value="*" key="All Personas">All Personas</option>
          {personasArray.map(option => (
            <option value={option.personaid} key={option.personaid}>{option.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
      }
    </Form>
  );
}

const CategorySelect = props => {
  // const categoryKids = [];
  const [categoryKids,setCategoryKids]=useState([]);

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    getCategoryKidsInfo(props.categoryid).then((data)=>{
      //console.log(data);
      if (isMounted) setCategoryKids(data.items);
    });
    return () => { isMounted = false };
  }, []);

  return(
    <Form.Group controlId="selectCategories" className="col">
      <Form.Label>{props.filterlabel}:</Form.Label>
        <Form.Control as="select" name="categoryid" custom onChange={ props.updateFilter } value={props.curCategoryId}>
          <option value="*" key="All Categories">All</option>
          {categoryKids.map((category, index) => (
            <option value={category.categoryid} key={index}>{category.name}</option>
          ))}
        </Form.Control>
    </Form.Group>
  )
}

const getCategoriesInfo = async (categoryIds) => {
  const feed = Mura.getFeed('category');
        feed.findMany(categoryIds);

  const query = await feed.getQuery();
  const categories = query.getAll();

  //console.log('categories getCategoriesInfo:' + JSON.stringify(categories, undefined, 2));
  return categories
}

const getPersonasInfo = async (personaIds) => {
  const feed = Mura.getFeed('persona');
        feed.findMany(personaIds);

  const query = await feed.getQuery();
  const personas = query.getAll();

  return personas
}

const getCategoryKidsInfo = async (categoryId) => {
  const feed = Mura.getFeed('category');
        feed.prop('parentid').isEQ(categoryId);

  const query = await feed.getQuery();
  const categorykids = query.getAll();

  //console.log('categories getCategoryKidsInfo:' + JSON.stringify(categorykids, undefined, 2));
  return categorykids
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

export default ResourceHub;