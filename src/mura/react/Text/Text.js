import React,{useState,useEffect} from 'react';
import Mura from 'mura.js';
import ReactMarkdown from "react-markdown";

function Text(props) {
  const objectparams = Object.assign({}, props);

  if(objectparams.sourcetype==='component' && !objectparams.dynamicProps){
    const [source, setSource]=useState('');

    useEffect(() => {
        getDynamicProps(objectparams).then((dynamicProps)=>{
          setSource(dynamicProps.source);
        });
    },[]);

    if(source){
      return (
        <ReactMarkdown source={source} />
      );
    } else {
      return (
        <div></div>
        );
    }
  } else {
    let source='';
    if(objectparams.sourcetype==='component' && objectparams.dynamicProps){
      source=objectparams.dynamicProps.source;
    } else {
      source=objectparams.source;
    }
    if(source && source !== 'unconfigured'){
      return (
        <ReactMarkdown source={source} />
      );
    } else {
      return (
        <div></div>
        );
    }
  }
}

export const getDynamicProps = async props => {
  const data = {};
  if (
    typeof props.sourcetype !== 'undefined' &&
    props.sourcetype === 'component'
  ) {
    if(Mura.isUUID(props.source)){
      const entity= await Mura.getEntity('content')
        .loadBy('contentid', props.source, { type: 'component', fields: 'body' });
        data.source=entity.get('body');
    } else {
      const entity= await Mura.getEntity('content')
      .loadBy('title', props.source, { type: 'component', fields: 'body' });
      data.source=entity.get('body');
    } 
  }

  return data;
};

export default Text;
