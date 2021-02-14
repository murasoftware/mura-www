import React from 'react';
import { useRouter } from 'next/router';
import Page from '../[...page]';
import { EditLayout, setMuraConfig, getMuraProps } from '@murasoftware/next-core';
import muraConfig from 'mura.config';

export async function getServerSideProps(context) {
  setMuraConfig(muraConfig);
  const props = await getMuraProps(context,true,{expand:'categoryassignments'});

  return props;
}

function Edit(props) {
  setMuraConfig(muraConfig);
  const router = useRouter();

  return (
    <EditLayout {...props}>
      <Page {...props} route={`/${router.query.page}`} />
    </EditLayout>
  );
}

export default Edit;