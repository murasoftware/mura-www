import React from 'react';
import Head from 'next/head';
import { EditLayout, MainLayout, setMuraConfig, MuraJSRefPlaceholder, getMuraProps, getRootPath, getSiteName } from '@murasoftware/next-core';
import Body from '../components/Body';
import muraConfig from 'mura.config';

export async function getServerSideProps(context) {
  setMuraConfig(muraConfig);
  const props = await getMuraProps(context,true,{expand:'categoryassignments'});
  return props;
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
  //console.log('content: ', content);
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
      </MainLayout>
    </EditLayout>
  );
}

