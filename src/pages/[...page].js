import React from 'react';
import { useRouter } from 'next/router';
import { EditLayout, setMuraConfig, MainLayout, MuraJSRefPlaceholder, getMuraProps, getRootPath, getMuraPaths, getSiteName } from '@murasoftware/next-core';
import ErrorPage from 'next/error';
import Body from '../components/Body';
import muraConfig, { DisplayOptions } from 'mura.config';
import MuraHead from 'src/modules/MuraHead';

export async function getServerSideProps(context) {
  try{
    setMuraConfig(muraConfig);
    const props = await getMuraProps(context,true,{expand:'categoryassignments'});
    return props;
  } catch (e){
    console.error(e);
    const props={};
    return props;
  }
}

export default function Page(props) {
  setMuraConfig(muraConfig);
  
  const router = useRouter();
  /*
   When in a route not defined in static routes it's intitially missing props
  */
  const {
    content = {},
    content: { displayregions } = {},
    content: {
      displayregions: { primarycontent,footer,header } = {},
    },
    moduleStyleData
  } = props;

  if(!content){
    return <ErrorPage statusCode="500" />
  } else if (content && typeof content.statusCode != 'undefined' && content.statusCode != 200){
    return <ErrorPage statusCode={content.statusCode} />
  } else if(content.isnew && !content.redirect){
    return <ErrorPage statusCode="404" />
  } else {
    return (
      <EditLayout {...props}>  
        <MainLayout {...props} route={`/${router.query.page}`}>  
          <MuraHead            
            content={content}
            getSiteName={getSiteName}
            MuraJSRefPlaceholder={MuraJSRefPlaceholder}
            getRootPath={getRootPath}
            codeblocks={props.codeblocks}
          />
          <div dangerouslySetInnerHTML={{__html:props.codeblocks.bodystart}}/>
          <Body
            content={content}
            moduleStyleData={moduleStyleData}
            header={header}
            primarycontent={primarycontent}
            footer={footer}
            displayregions={displayregions}
            props={props}
          />
          <div dangerouslySetInnerHTML={{__html:props.codeblocks.footer}}/>
            {DisplayOptions.cookieconsent && 
              <div className="mura-object" data-object='cookie_consent' data-statsid='cookie_consent' data-width='sm' />
            }
        </MainLayout>
      </EditLayout>
    );
  }
}
