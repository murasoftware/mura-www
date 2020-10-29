/* eslint-disable */
import Mura from 'mura.js';
import ComponentRegistry from './ComponentRegistry';

require('mura.js/src/core/stylemap-static');

let muraIsInit = false;
let contextIsInit = false;

export const getComponent = item => {
  getMura();

  const objectkey = Mura.firstToUpperCase(item.object);

  if (typeof ComponentRegistry[objectkey] != 'undefined') {
    const ComponentVariable = ComponentRegistry[objectkey].component;
    return <ComponentVariable key={item.instanceid} {...item} />;
  }

  return <p key={item.instanceid}>DisplayRegion: {item.objectname}</p>;
};

export const getMuraPaths = async () => {
  getMura();

  const pathList = await Mura.getFeed('content')
    .maxItems(0)
    .itemsPerPage(0)
    .sort('orderno')
    .getQuery()
    .then(collection => {
      let tempArray = collection.getAll().items;
      /*
      tempArray.unshift({
        url: '/',
        menutitle: 'Home',
        title: 'Home',
        filename: '',
        contentid: Mura.homeid,
      });
      */
      return tempArray;
    });

  const paths = pathList
    .map(item => {
      return { params: { page: item.filename.split('/') } };
    })
    .filter(function(item) {
      return item.params.page.length;
    });

  return paths;
};

export const getMura = context => {

  let config = {
    rootpath: 'http://localhost:8888',
    siteid: 'default',
    processMarkup: false,
    editroute: '/edit',
    sitename: 'Mura NextJS',
  };

  if (context && context.res) {
    Mura.init(Object.assign(
        config,
        { 
          response: context.res,
          request: context.req
        }
      )
    );
    contextIsInit = true;
    muraIsInit = true;
  } else if (!muraIsInit) {
    Mura.init(config);
    muraIsInit = true;
  }

  Mura.holdReady(true);

  return Mura;
};

export const getRootPath = () => {
  return getMura().rootpath;
};

export const getSiteName = () => {
  return getMura().sitename;
};

export const getMuraProps = async (context,isEditMode) => {
  const Mura=getMura(context);

  const muraObject = await renderContent(context);
  const content = muraObject.getAll();
  const moduleStyleData = await getRegionProps(muraObject,isEditMode);

  delete Mura._request;
  delete Mura.response;
  delete Mura.request;
  contextIsInit = false;
  muraIsInit = false;

  const props = {
    content: content,
    moduleStyleData: moduleStyleData
  };

  if(isEditMode){
    return {
      props
    };

  } else {
    return {
      props,
      revalidate:1
    };
  }
};

async function renderContent(context) {
  let query = {};

  if (context.browser) {
    query = Mura.getQueryStringParams();
  } else if (context.query) {
    query = context.query;
  }

  let filename = '';

  if (context.params && context.params.page) {
    filename = context.params.page;
  }

  if(Array.isArray(filename)){
    filename=filename.join("/");
  }
  
  return await Mura.renderFilename(filename, query).then(
    async rendered => {
      return rendered;
    },
    async rendered => {
      if (!rendered) {
        return Mura.getEntity('Content').set({
          title: '404',
          menutitle: '404',
          body: 'The content that you requested can not be found',
          contentid: Mura.createUUID(),
          isnew: 1,
          siteid: Mura.siteid,
          type: 'Page',
          subtype: 'Default',
          contentid: Mura.createUUID(),
          contenthistid: Mura.createUUID(),
          filename: '404',
          displayregions:{
            primarycontent:{
              local:{
                items:[]
              }
            }
          }
        });
      } else {
        return rendered;
      }
    },
  );
}



async function getRegionProps(content,isEditMode) {
  getMura();
  let moduleStyleData = {};
  const regions=Object.values(content.get('displayregions'));

  for(const regionIdx in regions){
   const region=regions[regionIdx]; 
    if (
      typeof region.inherited != 'undefined' &&
      Array.isArray(region.inherited.items)
    ) {
      for(const itemdIx in region.inherited.items){
        const item=region.inherited.items[itemdIx];
        item.instanceid = item.instanceid || Mura.createUUID();
        moduleStyleData[item.instanceid] = await getModuleProps(
          item,
          moduleStyleData,
          isEditMode,
          content
        );
      }
    }
   
    for(const itemIdx in region.local.items){
      const item=region.local.items[itemIdx];
      item.instanceid = item.instanceid || Mura.createUUID();
      moduleStyleData[item.instanceid] = await getModuleProps(
        item,
        moduleStyleData,
        isEditMode,
        content
      );
    }

  }

  return moduleStyleData;
}

async function getModuleProps(item,moduleStyleData,isEditMode,content) {
  getMura();

  const objectkey = Mura.firstToUpperCase(item.object);
  if (typeof ComponentRegistry[objectkey] != 'undefined') {

    item.dynamicProps = await ComponentRegistry[objectkey].getDynamicProps({...item,content});
    if (item.object == 'container') {
      if (
        typeof item.items != 'undefined' &&
        !Array.isArray(item.items)
      ) {
        try {
          item.items = JSON.parse(item.items);
        } catch (e) {
          item.items = [];
        }
      }
      for(const containerIdx in item.items){
        const containerItem=item.items[containerIdx];
        containerItem.instanceid = containerItem.instanceid || Mura.createUUID();
        moduleStyleData[containerItem.instanceid] = await getModuleProps(
          containerItem,
          moduleStyleData,
          isEditMode,
          content
        );
      }
    }
  }

  const styleData = Mura.recordModuleStyles(item);
 
  return {
    isEditMode:isEditMode,
    cssRules: styleData.cssRules,
    targets: styleData.targets,
    id: 'mura-styles' + item.instanceid,
    stylesupport: item.stylesupport || {},
    };

}

async function getPrimaryNavData() {
  getMura();

  return Mura.getFeed('content')
    .where()
    .prop('parentid')
    .isEQ(Mura.homeid)
    .sort('orderno')
    .getQuery()
    .then(collection => {
      let tempArray = collection.getAll().items;
      tempArray.unshift({
        url: '/',
        menutitle: 'Home',
        title: 'Home',
        filename: '',
        contentid: Mura.homeid,
      });
      return tempArray;
    });
}
