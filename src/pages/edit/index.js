import React from 'react';
import { useRouter } from 'next/router';
import { EditLayout } from '@murasoftware/next-core';
import Page from '../[...page]';
import { initConnector, getMuraProps } from '@murasoftware/next-core';
import muraConfig from 'mura.config';

export async function getServerSideProps(context) {
  initConnector(muraConfig);
  const props = await getMuraProps(context,true,{expand:'categoryassignments'});

  return props;
}

function Edit(props) {
  initConnector(muraConfig);
  const router = useRouter();

  return (
    <EditLayout {...props}>
      <Page {...props} route={`/${router.query.page}`} />
    </EditLayout>
  );
}

export default Edit;