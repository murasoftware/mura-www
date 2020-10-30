import React, { useContext } from 'react';
import GlobalContext from '../GlobalContext';

function MuraDecorator(props) {
  const { label, instanceid, labeltag, children } = props;
  let isEditMode = true;

  try {
    [isEditMode] = useContext(GlobalContext);
  } catch (e) {
    isEditMode = true;
  }
  //console.log("MuraDecorator -> isEditMode", isEditMode);

  const domObject = {
    className: 'mura-object mura-async-object',
  };

  const domContent = {
    className: 'mura-object-content',
  };

  const domMeta={
    className:"mura-object-meta"
  }

  const domMetaWrapper={
    className:"mura-object-meta-wrapper"
  }

  if (isEditMode) {
    Object.keys(props).forEach(key => {
      if (
        !['html', 'content', 'children', 'isEditMode', 'dynamicProps', 'moduleStyleData'].find(
          restrictedkey => restrictedkey === key,
        )
      ) {
        if (typeof props[key] === 'object') {
          domObject[`data-${key}`] = JSON.stringify(props[key]);
        } else if (
          typeof props[key] !== 'undefined' &&
          !(typeof props[key] === 'string' && props[key] === '')
        ) {
          domObject[`data-${key}`] = props[key];
        }
      }
      if (key === 'class') {
        domObject.className += ` ${props[key]}`;
      } else if (key === 'cssclass') {
        domObject.className += ` ${props[key]}`;
      } else if (key === 'cssid') {
        domObject.id += ` ${props[key]}`;
      } else if (key === 'contentcssclass') {
        domContent.className += ` ${props[key]}`;
      } else if (key === 'contentcssid') {
        domContent.id += ` ${props[key]}`;
      } else if (key === 'metacssclass') {
        domMeta.className += ` ${props[key]}`;
      } else if (key === 'metacssid') {
        domMeta.id += ` ${props[key]}`;
      }
    });
    
    if(domObject.className.split(' ').find($class => $class === 'container')){
      domMetaWrapper.className += ' container';
    }
  } else {
    domObject['data-instanceid'] = instanceid;
    domObject['data-inited'] = true;
    domObject.className = `mura-object-${props.object}`;

    if(typeof props.moduleStyleData != 'undefined' && typeof props.moduleStyleData[instanceid] != 'undefined'){
      domObject.className +=
        ` ${props.moduleStyleData[instanceid].targets.object.class}`;
      domObject.id = props.moduleStyleData[props.instanceid].targets.object.id;
      domContent.className =
        props.moduleStyleData[props.instanceid].targets.content.class;
      domContent.id = props.moduleStyleData[props.instanceid].targets.content.id;
      domMetaWrapper.className =
        props.moduleStyleData[props.instanceid].targets.metawrapper.class;
      domMeta.className =
        props.moduleStyleData[props.instanceid].targets.meta.class;
      domMeta.id =
        props.moduleStyleData[props.instanceid].targets.meta.id;
    } else {
      domObject.id = '';
      domContent.id = '';
      domMetaWrapper.className = '';
      domMeta.className = '';
      domMeta.id =';'
    }

    ['objectspacing','contentspacing','metaspacing'].forEach((key)=>{
      if(typeof props[key] != 'undefined' && props[key] && props[key] != 'custom'){
        domObject['data-' + key] = props[key];
      }
    });

  }
  
  return (
    <div {...domObject}>
      {label ? <MuraMeta label={label} labeltag={labeltag} dommeta={domMeta} dommetawrapper={domMetaWrapper}/> : null}
      {label ? <div className="mura-flex-break" /> : null}
      <div {...domContent}>{children}</div>
    </div>
  );
}

const MuraMeta = ({ label, labeltag, dommeta, dommetawrapper }) => {
  const LabelHeader = labeltag ? `${labeltag}` : 'h2';
  return (
    <div {...dommetawrapper}>
      <div {...dommeta}>
        <LabelHeader>{label}</LabelHeader>
      </div>
    </div>
  );
};

export default MuraDecorator;
