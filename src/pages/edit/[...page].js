import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import EditLayout from '../../components/EditLayout';
import Page from '../[...page]';
import { getMuraProps, getRootPath } from '../../helpers/MuraHelper';

export async function getServerSideProps(context) {

  const props = await getMuraProps(context,true);

  return props;
}

function Edit(props) {
  const router = useRouter();

  return (
    <EditLayout {...props}>
      <Head>
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
      <Page {...props} route={`/${router.query.page}`} />
    </EditLayout>
  );
}

export default Edit;