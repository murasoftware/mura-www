import React, { useEffect } from 'react';
import Mura from 'mura.js';
import MuraStyles from '@mura/react/MuraStyles';
import MuraExternalAssets from '@mura/react/MuraExternalAssets';
import {getMura} from '@mura/react/MuraConnector';

const MainLayout = props => {
  const { content, moduleStyleData, children } = props;

  Mura.moduleStyleData = moduleStyleData;

  useEffect(() => {
    contentDidChange(content);
  });

  return (
    <div>
      {children}  
      <MuraExternalAssets {...props}/>
      <MuraStyles {...props} />
    </div>
  );
};

function contentDidChange(_content) {
  const content = Mura.getEntity('content').set(_content);

  getMura();

  if (content.get('redirect')) {
    
    if(Mura.editroute){
      const pathArray=window.location.pathname.split('/').filter((item)=>{
        if(item){
          return true;
        }
      });
      let isEditMode=(pathArray.length && '/' + pathArray[0]==Mura.editroute);
      //console.log(isEditMode, pathArray,Mura.editroute, content.get('redirect').indexOf('lockdown'))
      /*
        If site is returning a lockdown redirect check if it's 
        and edit route first.  If it's not then redirect to the dynamic edit
        route so that it can get the dynamic content
      */

      if(!isEditMode && content.get('redirect').indexOf('lockdown')){
        let editroute="";

        if(pathArray.length){
          editroute="/edit/" +  pathArray.join("/") + "/";
          console.log('Redirecting to edit route',editroute)
          location.href = editroute;
        } else {
          editroute="/edit/";
          console.log('Redirecting to edit route',editroute)
          location.href = editroute;
        }   
      } else {
        console.log('Redirecting', content.get('redirect'))
        location.href = content.get('redirect');
      }
    } else {
      console.log('Redirecting', content.get('redirect'))
      //location.href = content.get('redirect');
    }

    return;
  }

  if (typeof Mura.deInitLayoutManager !== 'undefined') {
    // Mura.deInitLayoutManager();
  }

  // Ensure edit classes are removed
  Mura('html,body').attr('class', '');

  setTimeout(() => {
    // console.log("timeout",_content);
    const htmlQueueContainer = Mura('#htmlqueues');

    if (htmlQueueContainer.length) {
      Mura('#htmlqueues').html(
        content.get('htmlheadqueue') + content.get('htmlfootqueue'),
      );
    }

    if (typeof Mura.deInitLayoutManager !== 'undefined') {
      // Mura.deInitLayoutManager();
    }

    // Ensure edit classes are removed
    if (typeof MuraInlineEditor === 'undefined') {
      Mura('html,body').attr('class', '');
    }

    setTimeout(() => {
      // console.log("timeout",_content);
      const htmlQueueContainerInner = Mura('#htmlqueues');
      if (htmlQueueContainerInner.length) {
        Mura('#htmlqueues').html(
          content.get('htmlheadqueue') + content.get('htmlfootqueue'),
        );
      }

      Mura.init(Mura.extend({ queueObjects: false, content }));
      Mura.holdReady(false);

      if (!htmlQueueContainerInner.length) {
        // Mura.loader().loadjs(Mura.rootpath + "/core/modules/v1/core_assets/js/variation.js?siteid=" + Mura.siteid)
      }
    }, 5);
    
    Mura.init(Mura.extend({ queueObjects: false, content }));
    Mura.holdReady(false);
  }, 5);
}

export default MainLayout;
