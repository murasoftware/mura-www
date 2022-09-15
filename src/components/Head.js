import React from 'react';
import Head from 'next/head';
import ReactHTMLParser from 'html-react-parser';

export function HTMLHead(props) {
    const getSiteName = props.getSiteName;
    const content = props.content;
    const getRootPath = props.getRootPath;
    const MuraJSRefPlaceholder = props.MuraJSRefPlaceholder;
    const pageTitle=`${content.htmltitle} - ${getSiteName()}`;

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={content.metadesc} />

            <meta property="og:site_name" content={getSiteName()} />
            <meta property="og:title" content={content.htmltitle} />
            <meta property="og:description" content={content.metadesc} />
            <link href="https://fonts.googleapis.com/css?family=Open+Sans|Work+Sans:300,400,700&display=swap" rel="stylesheet" />
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
            {/* favicon */}
            <link rel="icon" href="/ico/favicon.ico" type="image/x-icon" />
            <link rel="shortcut icon" href="/ico/favicon.ico" type="image/x-icon" />
            <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/ico/apple-touch-icon-144-precomposed.png" />
            <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/ico/apple-touch-icon-114-precomposed.png" />
            <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/ico/apple-touch-icon-72-precomposed.png" />
            <link rel="apple-touch-icon-precomposed" href="/ico/apple-touch-icon-57-precomposed.png" />
            <script dangerouslySetInnerHTML={{__html:MuraJSRefPlaceholder}}/>
            {ReactHTMLParser(props.codeblocks.header.join(" "))}
        </Head>
    )
}

export default HTMLHead;