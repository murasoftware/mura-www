import React from 'react';
import { useRouter } from 'next/router';
import { initConnector, EditLayout } from '@murasoftware/next-core';
import Page from '../[...page]';
import { getMuraProps } from '@murasoftware/next-core';
import MuraConfig from 'mura.config';

export async function getServerSideProps(context) {
  initConnector(MuraConfig);
  const props = await getMuraProps(context,true,{expand:'categoryassignments'});

  return props;
}

function Edit(props) {
  initConnector(MuraConfig);
  const router = useRouter();

  return (
    <EditLayout {...props}>
      <Page {...props} route={`/${router.query.page}`} />
    </EditLayout>
  );
}

export default Edit;