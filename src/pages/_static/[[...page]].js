import React, { useDeferredValue, setState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MainLayout, MuraJSRefPlaceholder , getMuraProps} from '@murasoftware/next-core';
import ErrorPage from 'next/error';
import Body from '@components/Body';
import  {  DisplayOptions } from 'mura.config.js';
import Head from '@components/Head';
import Loading from '@components/Loading/Loading';
import {getConfiguredMura} from 'mura.config.js';

export async function getStaticPaths() {
    return {
      paths:[],
      fallback: true
    };
}

export const getStaticProps = async (context) => {

  const Mura=getConfiguredMura(context);

  const props= await getMuraProps(
    {
      context:context,
      Mura:Mura,
      renderMode:'static',
      params: {
          expand:'categoryassignments'
      }
    }
  );

  if(props?.props?.content?.config?.restricted){
    props.props.content.body='';
    delete props.props.content.displayregions.primarycontent;
  }

  Mura.deInit();
  
  return props;
 
}

export default function Page(props) {
  const router = useRouter();
  const [muraRef,setMuraRef]=React.useState(false);

  if (router.isFallback) {
    return <Loading />
  }

  let {
    content = {},
    content: { displayregions } = {},
    content: {
      displayregions: { primarycontent,footer,header } = {},
    },
    codeblocks,
    moduleStyleData,
    queryParams = {},
    renderMode
  } = props;

  if(!content){
    return <ErrorPage statusCode="500" />
  } else if (content && typeof content.statusCode != 'undefined' && content.statusCode != 200){
    return <ErrorPage statusCode={content.statusCode} />
  } else if(content.isnew && !content.redirect){
    return <ErrorPage statusCode="404" />
  } else {

    if(!muraRef){
      getConfiguredMura(content.siteid).then((Mura)=>{
        //console.log('firstToUpperCase',Mura.firstToUpperCase)
        setMuraRef({Mura:Mura});
      });
      return <Loading />
    }

    const Mura=muraRef.Mura;
    Mura.renderMode=renderMode;

    return (
      <MainLayout {...props} Mura={Mura} route={`/${router.query.page}`}>  
        <Head            
          content={content}
          MuraJSRefPlaceholder={MuraJSRefPlaceholder}
          codeblocks={codeblocks}
          Mura={Mura}
        />
        <div dangerouslySetInnerHTML={{__html:codeblocks.bodystart}}/>
        <Body
          content={content}
          moduleStyleData={moduleStyleData}
          header={header}
          primarycontent={primarycontent}
          footer={footer}
          displayregions={displayregions}
          queryParams={queryParams}
          props={props}
          Mura={Mura}
        />
        <div dangerouslySetInnerHTML={{__html:codeblocks.footer}}/>
          {DisplayOptions.cookieconsent && 
            <div className="mura-object" data-object='cookie_consent' data-statsid='cookie_consent' data-width='sm' />
          }
      </MainLayout>
    );
  }
}
