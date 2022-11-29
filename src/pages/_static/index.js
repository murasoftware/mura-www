import React,{ useEffect } from 'react';
import ErrorPage from 'next/error';
import { MainLayout, setMuraConfig, MuraJSRefPlaceholder, getMura, getMuraProps } from '@murasoftware/next-core';
import Body from '@components/Body';
import muraConfig, { DisplayOptions } from 'mura.config';
import Head from '@components/Head';

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

  if(props.props.content.config.restricted){
    props.props.content.body='';
    delete props.props.content.displayregions.primarycontent;
  }

  return props;
}

export default function Page(props) {

  const {
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

  /*
   When in a route not defined in static routes it's intitially missing props
  */
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
      <MainLayout {...props}  Mura={Mura}>
        <Head            
          content={content}
          MuraJSRefPlaceholder={MuraJSRefPlaceholder}
          codeblocks={props.codeblocks}
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
          props={props}
          queryParams={queryParams}
          Mura={Mura}
          renderMode={renderMode}
        />
        <div dangerouslySetInnerHTML={{__html:codeblocks.footer}}/>
        {DisplayOptions.cookieconsent && 
          <div className="mura-object" data-object='cookie_consent' data-statsid='cookie_consent' data-width='sm' />
        }
        </MainLayout>
    );
  }
}

