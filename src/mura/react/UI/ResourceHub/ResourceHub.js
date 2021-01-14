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

  let _collection = false;
  if(objectparams.dynamicProps){
    _collection=new Mura.EntityCollection(objectparams.dynamicProps.collection,Mura._requestcontext);
  }
  const [collection,setCollection]=useState(_collection);

  //SET DEFAULTS FOR CURRENT FILTER PARAMETERS
  const _curSubtype = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.subtype : '*';
  const _curCategoryIds = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.categoryid : '*';
  const _curPersonaId = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.personaid : '*';
  const _curCategoriesArray = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.selectedcats : [];
  
  console.log(objectparams.dynamicProps);
  console.log('selected cats: ', _curCategoriesArray);

  const [curSubtype, setCurSubtype]=useState(_curSubtype);
  const [curCategoriesArray, setCurCategoriesArray]=useState(_curCategoriesArray);
  const [curCategoryIds, setCurCategoryIds]=useState(_curCategoryIds);
  const [curPersonaId, setCurPersonaId]=useState(_curPersonaId);

  //UPDATE COLLECTION & FILTERPROPS WHEN FILTERS ARE UPDATED
  useEffect(() => {
    let isMounted = true;
    if (isMounted) getFilterProps(curSubtype,curCategoryIds,curPersonaId,curCategoriesArray).then((filterProps) => {      
      getCollection(props,filterProps).then((collection) => {
        setCollection(collection);
      })
    });
    return () => { isMounted = false };
  }, [curSubtype,curCategoryIds,curPersonaId])

  const updateFilter = (e) => {
    console.log('submitted values: ' + e.target.name + ', ' + e.target.value);
    switch(e.target.name) {
      case 'subtype':
        let subtype = e.target.value;
        //todo: check that values have changed before setting
        setCurSubtype(subtype);
        break
      case 'personaid':
        let personaid = e.target.value;
        setCurPersonaId(personaid);
        break
      default:
        setCurCategoriesArray(updateCategoryIds(e.target.name,e.target.value,curCategoriesArray));
        setCurCategoryIds(getCategoryIds(curCategoriesArray));
    }//switch    
  }
  
  if(!objectparams.dynamicProps){
    useEffect(() => {
      let isMounted = true;
      if (isMounted) getDynamicProps(objectparams).then((dynamicProps)=>{
        setCollection(new Mura.EntityCollection(dynamicProps.collection,Mura._requestcontext));
        setCurSubtype(dynamicProps.filterprops.subtype);
      });
      return () => { isMounted = false };
    }, []);

    if(collection) {
      return (
        <div>
          <h1>Dynamic {thisTitle}</h1>

          <RenderFilterForm 
            updateFilter={updateFilter}
            {...props}
            curSubtype={curSubtype}
            curCategoryId={curCategoryIds}
            curPersonaId={curPersonaId}
            curCategoriesArray={curCategoriesArray}
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
      // setCurSubtype(objectparams.dynamicProps.filterprops.subtype);
      return (
        <div>
          <h1>SSR {thisTitle}</h1>
          <RenderFilterForm 
            updateFilter={updateFilter}
            {...props}
            curSubtype={curSubtype}
            curCategoryId={curCategoryIds}
            curPersonaId={curPersonaId}
            curCategoriesArray={curCategoriesArray}
          />
          <DynamicCollectionLayout collection={collection} props={props} link={RouterLink}/>
        </div>
      )
  }
}

const getCategoryIds = categories => {
  let categoriesList;
  for (let i = 0; i < categories.length; i++){
    if (categories[i].value != '*'){
      if (i < 1){
        categoriesList = categories[i].value;
      } else {
        categoriesList = categoriesList + ',' + categories[i].value;
      }
    }
  }
  
  if (categoriesList == undefined){
    categoriesList = '*';
  }
  return categoriesList
}

export const getDynamicProps = async props => {
  const filterProps = await getFilterProps('','','','');
  const collection = await getCollection(props,filterProps);
  if(!Array.isArray(filterProps.selectedcats)){
    try{
      filterProps.selectedcats = JSON.parse(filterProps.selectedcats);
    }catch(e){
      filterProps.selectedcats = [];
    }
  }
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
      feed.maxItems(props.maxitems);
      feed.itemsPerPage(0);

      let collection;

      if(filterProps.personaid.length){
        collection = await feed.getQuery({sortBy:"mxpRelevance"});
      } else {
        collection = await feed.sort('releasedate','desc').getQuery();
      }  

  return collection;
}

const getFilterProps = async (subtype,categoryid,personaid,selectedcategories) => {
  const Subtype = subtype;
  const Categoryid = categoryid;
  const Personaid = personaid;
  const CurSelectedCats = selectedcategories;

  console.log('CurSelectedCats: ' + CurSelectedCats);

  const filterProps = await Mura.getEntity('resourcehub').invoke('processFilterArgs',{subtype:Subtype, categoryid:Categoryid, personaid:Personaid, selectedcats:CurSelectedCats});
  
  console.log('filterProps: ' + JSON.stringify(filterProps,undefined,2));
  return filterProps;
}

const RenderFilterForm = (props) => {
  const objectparams = Object.assign({}, props);
  const [categoriesArray,setCategoriesArray]=useState(false);
  const [personasArray,setPersonasArray]=useState(false);

  const subtypesArray = objectparams.subtypes ? objectparams.subtypes.split(',') : [];
  const categoryIds = objectparams.categoryids ? objectparams.categoryids.split(',') : [];
  const personaIds = objectparams.personaids ? objectparams.personaids.split(',') : [];
  
  useEffect(() => {
    let isMounted = true;
    getCategoriesInfo(categoryIds).then((data)=>{
      if (isMounted) setCategoriesArray(data.items);
    });
    if(personaIds.lenth){
      getPersonasInfo(personaIds).then((data)=>{
        if (isMounted) setPersonasArray(data.items);
        
      });
    }    
    return () => { isMounted = false };
  }, []);
  // console.log(props.curCategoryId);
  return (
    <Form className="row row-cols-3" id="filterForm">
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
          <CategorySelect categoryid={category.categoryid} filterlabel={category.name} updateFilter={props.updateFilter} curCategoryId={props.curCategoryId} key={category.categoryid} curCategoriesArray={props.curCategoriesArray} />
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
  const [categoryKids,setCategoryKids]=useState([]);

  useEffect(() => {
    let isMounted = true;
    getCategoryKidsInfo(props.categoryid).then((data)=>{
      if (isMounted) setCategoryKids(data.items);
    });
    return () => { isMounted = false };
  }, []);
  let curSelectValue = '*';
  
  for (let i=0; i < categoryKids.length; i++){
    // console.log(categoryKids[i].categoryid);    
      if (props.curCategoryId.includes(categoryKids[i].categoryid)){
        console.log('match! ' + categoryKids[i].name + ' : ' + categoryKids[i].categoryid);
        curSelectValue = categoryKids[i].categoryid;
        break
      }
  }

  console.log('current selected value: ' + curSelectValue);
  return(
    <Form.Group controlId={`selectCategories${props.filterlabel}`} className="col">
      <Form.Label>{props.filterlabel}:</Form.Label>
        <Form.Control as="select" name={`categoryid${props.filterlabel}`} custom onChange={ props.updateFilter } value={curSelectValue}>
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

  return categorykids
}

const updateCategoryIds = (name,value,curCategoriesArray) => {
  let match = 0;

  // if (!Array.isArray(curCategoriesArray)){
  //   curCategoriesArray = [];
  // }
    for (let i = 0; i < curCategoriesArray.length; i++) {
      if (curCategoriesArray[i].name === name) {
            curCategoriesArray[i].value = value;
          match = 1;
          break;
      }
    }
    if (!match){
      curCategoriesArray.push({ 
        name:name,
        value:value 
      });
    }
  
  return curCategoriesArray;
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