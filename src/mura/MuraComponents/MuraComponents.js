import Mura from 'mura.js';
import Example from '@mura/Example';
import Text, {getDynamicProps as  getTextProps } from '@mura/Text';
import Collection, {getDynamicProps as getCollectionProps } from '@mura/Collection';
import Video from '@mura/Video';
import Image from '@mura/Image';
import Container from '@mura/Container';
import Embed from '@mura/Embed';
import Hr from '@mura/Hr';
import PrimaryNav,{getDynamicProps as getPrimaryNavProps} from '@mura/PrimaryNav';
import CTAButton from '@mura/CTAButton';

import DefaultLayout from '@mura/Collection/Layouts/DefaultLayout';
import CollectionLayout,{getQueryProps as getCollectionLayoutProps} from '@mura/Collection/Layouts/CollectionLayout';
import Cards from '@mura/Collection/Layouts/Cards';
import List from '@mura/Collection/Layouts/List';
import AccordionLayout from '@mura/Collection/Layouts/Accordion';
import AlternatingBoxes from '@mura/Collection/Layouts/AlternatingBoxes';
import AlternatingRows from '@mura/Collection/Layouts/AlternatingRows';
import Masonry from '@mura/Collection/Layouts/Masonry';
import SlickSlider from '@mura/Collection/Layouts/SlickSlider';

import React from 'react';
import ReactDOM from 'react-dom';

//This module is also registered with Mura via the ./static/mura.config.json

let moduleRegistry = [
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
    getDynamicProps: getPrimaryNavProps,
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

moduleRegistry.forEach(module => {
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
    getQueryProps: module.getQueryProps
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

export default moduleLookup;