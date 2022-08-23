import React,{ useEffect } from 'react';
import ErrorPage from 'next/error';
import { EditLayout, MainLayout, setMuraConfig, MuraJSRefPlaceholder, getMura, getMuraProps } from '@murasoftware/next-core';
import Body from '@components/Body';
import muraConfig, { DisplayOptions } from 'mura.config';
import Head from '@components/Head';

export async function getServerSideProps(context) {

  try{
    setMuraConfig(muraConfig);
    
    const Mura=getMura(context);
    
    return getMuraProps(
      {
        context:context,
        Mura:Mura,
        renderMode:'dynamic',
        params: {
            expand:'categoryassignments'
        }
      }
    );

    } catch(e){
      console.log(e);
      return {
        props:{}
      };
    }
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
    
    Mura.setRenderMode(renderMode);

    return (
      <EditLayout {...props}  Mura={Mura}>
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
          />
          <div dangerouslySetInnerHTML={{__html:codeblocks.footer}}/>
          {DisplayOptions.cookieconsent && 
            <div className="mura-object" data-object='cookie_consent' data-statsid='cookie_consent' data-width='sm' />
          }
        </MainLayout>
      </EditLayout>
    );
  }
}

