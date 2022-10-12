import Mura from 'mura.js';
import { 
          Text, getTextDynamicProps,
          Collection, getCollectionDynamicProps,
          Video,
          Image,
          Container,
          Embed,
          Hr,
          PrimaryNav, getPrimaryNavDynamicProps,
          ResourceHub, getResourceHubDynamicProps,
          ArticleMeta,
          CTAButton,
          PrivacyTools,
          MatrixSelector, getMatrixSelectorDynamicProps,
          CollectionLayout,getCollectionLayoutQueryProps as getCollectionLayoutProps,
          CollectionLayoutCards as Cards,
          CollectionLayoutList as List,
          CollectionLayoutAccordion as AccordionLayout,
          CollectionLayoutAlternatingBoxes as AlternatingBoxes,
          CollectionLayoutAlternatingRows as AlternatingRows,
          CollectionLayoutMasonry as Masonry,
          CollectionLayoutSlickSlider as SlickSlider,
          UtilityNav,
          GatedAsset,
          Gist,
          SearchResults, getSearchResultsDynamicProps,
          SearchResultsLayout
} from '@murasoftware/next-modules-bs4'; 

import React from 'react';
import ReactDOM from 'react-dom';

//Example Custom Module
import Example from '@components/Example';

//import {default as PrimaryNav, getDynamicProps as getPrimaryNavDynamicProps} from '@components/PrimaryNav';
// import {default as Collection, getDynamicProps as getCollectionDynamicProps} from '@components/Collection';

export const ConnectorConfig = {
  rootpath: process.env.rootpath,
  siteid: process.env.siteid,
  processMarkup: false,
  editroute: process.env.editroute,
  sitename: process.env.sitename,
  siteidinurls:  process.env.siteidinurls,
  codeblocks: process.env.codeblocks,
  variations: process.env.variations,
  MXP: process.env.MXP,
  htmleditortype: process.env.htmleditortype
};

export const DisplayOptions = {
  cookieconsent: true
}

/*
  These module are also registered with Mura via the mura.config.json

  Proxied modules are modules that are handled by standard Mura.js 
  and/or traditional serverside rendering from within the Mura service
*/
let moduleRegistry = [
  {
    name: 'cta',
    js:[
      ConnectorConfig.rootpath + "/core/modules/v1/cta/js/mura.displayobject.cta.min.js",
    ],
    SSR: false
  },
  {
    name: 'content_gate',
    js:[
      ConnectorConfig.rootpath + "/core/modules/v1/content_gate/js/mura.displayobject.content_gate.min.js",
    ],
    SSR: false
  },
  {
    name: 'pdfviewer',
    js:[
      ConnectorConfig.rootpath + "/core/modules/v1/pdfviewer/dist/main.bundle.js",
    ],
    SSR: false
  },
  {
    name: 'form',
    SSR: false
  },
  {
    name: 'cookie_consent',
    SSR: false
  },
  {
    name: 'login',
    SSR: false
  },
  {
    name: 'Example',
    component: Example,
  },
  {
    name: 'GatedAsset',
    component: GatedAsset
  },
  {
    name: 'Gist',
    component: Gist
  },
  {
    name: 'Text',
    component: Text,
    getDynamicProps: getTextDynamicProps,
  },
  {
    name: 'Collection',
    component: Collection,
    getDynamicProps: getCollectionDynamicProps,
  },
  {
    name: 'Video',
    component: Video,
  },
  {
    name: 'Image',
    component: Image,
  },
  {
    name: 'Container',
    component: Container
  },
  {
    name: 'Hr',
    component: Hr
  },
  {
    name: 'Embed',
    component: Embed
  },
  {
    name: 'CTAButton',
    component: CTAButton
  },
  {
    name: 'CollectionLayout',
    component: CollectionLayout,
    getQueryProps: getCollectionLayoutProps,
    excludeFromClient: true
  },
  /*{
    name: 'DefaultLayout',
    component: DefaultLayout,
    excludeFromClient: true
  },*/
  {
    name: 'PrimaryNav',
    component: PrimaryNav,
    getDynamicProps: getPrimaryNavDynamicProps
  },
  {
    name: 'resource_hub',
    component: ResourceHub,
    getDynamicProps: getResourceHubDynamicProps,
    //SSR: false
  },
  {
    name: 'privacy_tools',
    component: PrivacyTools,
    SSR: false
  },
  {
    name: 'matrix_selector',
    component: MatrixSelector,
    getDynamicProps: getMatrixSelectorDynamicProps,
    SSR: false
  },
  {
    name: 'ArticleMeta',
    component: ArticleMeta
  },
  {
    name: 'Cards',
    component: Cards,
    excludeFromClient: true
  },
  {
    name: 'List',
    component: List,
    excludeFromClient: true
  },
  {
    name: 'AccordionLayout',
    component: AccordionLayout,
    excludeFromClient: true
  },
  {
    name: 'AlternatingBoxes',
    component: AlternatingBoxes,
    excludeFromClient: true
  },
  {
    name: 'AlternatingRows',
    component: AlternatingRows,
    excludeFromClient: true
  },
  {
    name: 'Masonry',
    component: Masonry,
    excludeFromClient: true
  },
  {
    name: 'SlickSlider',
    component: SlickSlider,
    excludeFromClient: true
  },
  {
    name: 'SearchResults',
    component: SearchResults,
    getDynamicProps: getSearchResultsDynamicProps
  },
  {
    name: 'UtilityNav',
    component: UtilityNav,
    SSR: false    
  },
  {
    name: 'SearchResultsLayout',
    component: SearchResultsLayout,
    excludeFromClient: true
  }
];

let moduleLookup = {};
let externalLookup = {};

moduleRegistry.forEach(module => {
  if(typeof module.component == 'undefined'){
    externalLookup[module.name]=module;
  } else {
    if(typeof module.SSR == 'undefined' && typeof module.ssr == 'undefined'){
      module.SSR=true;
    }
    module.getDynamicProps =
      module.getDynamicProps ||
      function() {
        return {};
      };
    module.getQueryProps =
      module.getQueryProps ||
      function() {
        return {fields:''};
      };
    moduleLookup[module.name] = {
      component: module.component,
      getDynamicProps: module.getDynamicProps,
      getQueryProps: module.getQueryProps,
      SSR:module.SSR
    };
    if (!module.excludeFromClient) {
      Mura.Module[module.name] = Mura.UI.extend({
        component: module.component,
        clientRendered: false,
        renderClient() {
          
          const content = Mura.content.getAll();
         
          ReactDOM.render(
            React.createElement(this.component, {...this.context,content}),
            this.context.targetEl,
            () => {
              this.trigger('afterRender');
            },
          );

          this.clientRendered=true;
        },
        destroy(){
          if( this.clientRendered
              && this.context 
              && this.context.targetEl 
              && this.context.targetEl.innerHTML){
            ReactDOM.unmountComponentAtNode(this.context.targetEl);
          }
        }
      });
    }
  }
});

Mura.Module.Container.reopen({
	reset(self, empty) {
    if(empty){
      self.find('.mura-object:not([data-object="container"])').html('');
      self.find('.frontEndToolsModal').remove();
      self.find('.mura-object-meta').html('');
    }
	  var content = self.children('div.mura-object-content');
 
	  if (content.length) {
		var nestedObjects = [];
		content.children('.mura-object').each(function() {
		  Mura.resetAsyncObject(this, false);
		  //console.log(Mura(this).data())
      const item=Mura(this).data();
      delete item.inited;
		  nestedObjects.push(item);
		});
		self.data('items', JSON.stringify(nestedObjects));
	  }
	},
});

Mura.Module.GatedAsset.reopen({
	reset(self, empty) {
	  self.find('.frontEndToolsModal').remove();
	  self.find('.mura-object-meta').html('');
  
	  var gate = self.find('.mura-gate > div.mura-object');
  
	  if (gate.length) {
      Mura.resetAsyncObject(gate.node, empty);
      const gateparams=gate.data();
      delete gateparams.inited;
      self.data('gateparams', JSON.stringify(gateparams));
	  }

    var asset = self.find('.mura-asset > div.mura-object');

    if (asset.length) {
      Mura.resetAsyncObject(asset.node, empty);
      const assetparams=asset.data();
      delete assetparams.inited;
      self.data('assetparams', JSON.stringify(assetparams));
	  }

	},
});

export const ComponentRegistry=moduleLookup;
export const ExternalModules=externalLookup;
export const muraConfig = {
  ComponentRegistry,
  ExternalModules,
  ConnectorConfig
};

export default {
  ComponentRegistry,
  ExternalModules,
  ConnectorConfig
};
