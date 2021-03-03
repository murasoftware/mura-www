import Mura from 'mura.js';
import { Text, getTextDynamicProps } from '@murasoftware/next-modules-bs4';
import { Collection, getCollectionDynamicProps } from '@murasoftware/next-modules-bs4';
import { Video }from '@murasoftware/next-modules-bs4';
import { Image } from '@murasoftware/next-modules-bs4';
import { Container } from '@murasoftware/next-modules-bs4';
import { Embed }from '@murasoftware/next-modules-bs4';
import { Hr } from '@murasoftware/next-modules-bs4';
import { PrimaryNav, getPrimaryNavDynamicProps } from '@murasoftware/next-modules-bs4';
import { ResourceHub, getResourceHubDynamicProps } from '@murasoftware/next-modules-bs4';
import { ArticleMeta } from '@murasoftware/next-modules-bs4';
import { CTAButton } from '@murasoftware/next-modules-bs4';
import { PrivacyTools } from '@murasoftware/next-modules-bs4';
import { MatrixSelector, getMatrixSelectorDynamicProps } from '@murasoftware/next-modules-bs4';
//import Login from '@mura/react/UI/Login';

import { CollectionLayout,getCollectionLayoutQueryProps as getCollectionLayoutProps } from '@murasoftware/next-modules-bs4';
import { CollectionLayoutCards as Cards } from '@murasoftware/next-modules-bs4';
import { CollectionLayoutList as List } from '@murasoftware/next-modules-bs4';
import { CollectionLayoutAccordion as AccordionLayout } from '@murasoftware/next-modules-bs4';
import { CollectionLayoutAlternatingBoxes as AlternatingBoxes } from '@murasoftware/next-modules-bs4';
import { CollectionLayoutAlternatingRows as AlternatingRows } from '@murasoftware/next-modules-bs4';
import { CollectionLayoutMasonry as Masonry }from '@murasoftware/next-modules-bs4';
import { CollectionLayoutSlickSlider as SlickSlider } from '@murasoftware/next-modules-bs4';

import React from 'react';
import ReactDOM from 'react-dom';

//Example Custom Module
import Example from '@components/Example';

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
    css:[
      ConnectorConfig.rootpath + "/core/modules/v1/pdfviewer/assets/css/pdfviewer.css",
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
    name: 'Login',
    SSR: false
  },
  {
    name: 'Example',
    component: Example,
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
    component: Hr,
  },
  {
    name: 'Embed',
    component: Embed,
  },
  {
    name: 'CTAButton',
    component: CTAButton,
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
        renderClient() {
          
          const content = Mura.content.getAll();

          ReactDOM.render(
            React.createElement(this.component, {...this.context,content}),
            this.context.targetEl,
            () => {
              this.trigger('afterRender');
            },
          );
        },
      });
    }
  }
});

Mura.Module.Container.reopen({
	reset(self, empty) {
	  self.find('.mura-object:not([data-object="container"])').html('');
	  self.find('.frontEndToolsModal').remove();
	  self.find('.mura-object-meta').html('');
	  var content = self.children('div.mura-object-content');
  
	  if (content.length) {
		var nestedObjects = [];
		content.children('.mura-object').each(function() {
		  Mura.resetAsyncObject(this, empty);
		  //console.log(Mura(this).data())
		  nestedObjects.push(Mura(this).data());
		});
		self.data('items', JSON.stringify(nestedObjects));
		self.removeAttr('data-content');
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
