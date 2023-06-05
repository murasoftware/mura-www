import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getMuraPaths, setMuraConfig, MainLayout, MuraJSRefPlaceholder ,getMura, getMuraProps} from '@murasoftware/next-core';
import ErrorPage from 'next/error';
import Body from '@components/Body';
import muraConfig, { DisplayOptions } from 'mura.config';
import Head from '@components/Head';
import Loading from '@components/Loading/Loading';

export async function getStaticPaths() {
  if(muraConfig.ConnectorConfig.multitenant){
    return {
      paths:[],
      fallback: true
    };
  } else { 
    setMuraConfig(muraConfig);
    const paths = await getMuraPaths();

    /* 
      set to blocking instead of fallback because of"
      https://github.com/vercel/next.js/issues/26145
    */

    return {
      paths,
      fallback: true
    };
  }
}

export const getStaticProps = async (context) => {
  setMuraConfig(muraConfig);

  const Mura=getMura(context);
  
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

    setMuraConfig(muraConfig);
    
    const Mura = getMura(content.siteid);

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
