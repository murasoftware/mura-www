import Mura from 'mura.js';
import Text, {getDynamicProps as  getTextProps } from '@mura/react/UI/Text';
import Collection, {getDynamicProps as getCollectionProps } from '@mura/react/UI/Collection';
import Video from '@mura/react/UI/Video';
import Image from '@mura/react/UI/Image';
import Container from '@mura/react/UI/Container';
import Embed from '@mura/react/UI/Embed';
import Hr from '@mura/react/UI/Hr';
import PrimaryNav,{getDynamicProps as getPrimaryNavProps} from '@mura/react/UI/PrimaryNav';
import ResourceHub,{getDynamicProps as getResourceHubProps} from '@mura/react/UI/ResourceHub';
import ArticleMeta from '@mura/react/UI/ArticleMeta';
import CTAButton from '@mura/react/UI/CTAButton';
//import Login from '@mura/react/UI/Login';

import DefaultLayout from '@mura/react/UI/Collection/Layouts/DefaultLayout';
import CollectionLayout,{getQueryProps as getCollectionLayoutProps} from '@mura/react/UI/Collection/Layouts/CollectionLayout';
import Cards from '@mura/react/UI/Collection/Layouts/Cards';
import List from '@mura/react/UI/Collection/Layouts/List';
import AccordionLayout from '@mura/react/UI/Collection/Layouts/Accordion';
import AlternatingBoxes from '@mura/react/UI/Collection/Layouts/AlternatingBoxes';
import AlternatingRows from '@mura/react/UI/Collection/Layouts/AlternatingRows';
import Masonry from '@mura/react/UI/Collection/Layouts/Masonry';
import SlickSlider from '@mura/react/UI/Collection/Layouts/SlickSlider';

import React from 'react';
import ReactDOM from 'react-dom';

//Example Custom Module
import Example from 'src/Example';

export const ConnectorConfig = {
  rootpath: 'http://localhost:8888',
  siteid: ['default'],
  processMarkup: false,
  editroute: '/edit',
  sitename: 'Example Site',
  siteidinurls:false,
  codeblocks:true,
  variations:true,
  MXP:false
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
    name: 'cookie_content',
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
    getDynamicProps: getTextProps,
  },
  {
    name: 'Collection',
    component: Collection,
    getDynamicProps: getCollectionProps,
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
    component: Container,
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
  {
    name: 'DefaultLayout',
    component: DefaultLayout,
    excludeFromClient: true
  },
  {
    name: 'PrimaryNav',
    component: PrimaryNav,
    getDynamicProps: getPrimaryNavProps
  },
  {
    name: 'resource_hub',
    component: ResourceHub,
    getDynamicProps: getResourceHubProps
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
export default moduleLookup;
