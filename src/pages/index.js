import React from 'react';
import Head from 'next/head';
import ErrorPage from 'next/error';
import { EditLayout, MainLayout, setMuraConfig, MuraJSRefPlaceholder, getMuraProps, getRootPath, getSiteName } from '@murasoftware/next-core';
import Body from '../components/Body';
import muraConfig from 'mura.config';

export async function getServerSideProps(context) {
  try {
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
  const {
    content = {},
    content: { displayregions } = {},
    content: {
      displayregions: { primarycontent,footer,header } = {},
    },
    moduleStyleData
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
    return (
      <EditLayout {...props}>
        <MainLayout {...props}>
          <Head>
            {/* I wanted to add a "MuraMetaTags" component here but doesn't seem possible inside the <Head> component -- see metaTags branch */}
            <title>{content.htmltitle} - {getSiteName()}</title>
            <meta name="description" content={content.metadesc} />

            <meta property="og:site_name" content={getSiteName()} />
            <meta property="og:title" content={content.htmltitle} />
            <meta property="og:description" content={content.metadesc} />
            {content.images && content.images.large &&
              <meta property="og:image" content={content.images.large} />
            }
            <meta property="og:type" content="website" />
            
            {content.canonicalurl != '' &&
              <link rel="canonical" href={content.canonicalurl} />
            }

            {content.canonicalurl == '' &&
              <link rel="canonical" href={`${getRootPath()}/${content.filename}`} />
            }

            <link
              href={`${getRootPath()}/core/modules/v1/core_assets/css/mura.10.min.css`}
              rel="stylesheet"
              key="min"
            />
            <link
              href={`${getRootPath()}/core/modules/v1/core_assets/css/mura.10.skin.css`}
              rel="stylesheet"
              key="skin"
            />
            <script dangerouslySetInnerHTML={{__html:MuraJSRefPlaceholder}}/>
            {/* favicon */}
            <link rel="icon" href="/ico/favicon.ico" type="image/x-icon" />
            <link rel="shortcut icon" href="/ico/favicon.ico" type="image/x-icon" />
            <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/ico/apple-touch-icon-144-precomposed.png" />
            <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/ico/apple-touch-icon-114-precomposed.png" />
            <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/ico/apple-touch-icon-72-precomposed.png" />
            <link rel="apple-touch-icon-precomposed" href="/ico/apple-touch-icon-57-precomposed.png" />
          </Head>
          <div dangerouslySetInnerHTML={{__html:props.codeblocks.header}}/>
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
          <div className="mura-object" data-object='cookie_consent' data-statsid='cookie_consent' data-width='sm' data-buttonclass='btn btn-sm btn-primary' />
        </MainLayout>
      </EditLayout>
    );
  }
}

