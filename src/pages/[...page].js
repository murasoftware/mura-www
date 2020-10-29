import React from 'react';
import Head from 'next/head';
import { getMuraProps, getRootPath, getMuraPaths, getSiteName } from '@helpers/MuraHelper';

import MainLayout from '../components/MainLayout';
import DisplayRegion from '../components/DisplayRegion';

export async function getStaticPaths() {
  const paths = await getMuraPaths();

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  // console.log("CON",context);
  const props = await getMuraProps(context,false);
  return props;
}

export default function Page(props) {
  /*
   When in a route not defined in static routes it's intitially missing props
  */
  if(!props.content){
    return '';
  }

  const {
    content = {},
    content: { displayregions } = {},
    content: {
      displayregions: { primarycontent,footer,header } = {},
    },
    moduleStyleData
  } = props;

  return (
    <MainLayout {...props}>  
      <Head>
        {/* I wanted to add a "MuraMetaTags" component here but doesn't seem possible inside the <Head> component -- see metaTags branch */}
        <title>{content.htmltitle} - {getSiteName()}</title>
        <meta name="description" content={content.metadesc} />

        <meta property="og:site_name" content={getSiteName()} />
        <meta property="og:title" content={content.htmltitle} />
        <meta property="og:description" content={content.metadesc} />
        {content.images.large &&
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
      </Head>
      {content && displayregions && header && (
        <DisplayRegion
          region={header}
          moduleStyleData={moduleStyleData}
          content={content}
        />
      )}
      {content && displayregions && primarycontent && (
        <DisplayRegion
          region={primarycontent}
          moduleStyleData={moduleStyleData}
          content={content}
        />
      )}
       {content && displayregions && footer && (
        <DisplayRegion
          region={footer}
          moduleStyleData={moduleStyleData}
          content={content}
        />
      )}
    </MainLayout>
  );
}
