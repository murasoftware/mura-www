import React from 'react';
import { useRouter } from 'next/router';
import { EditLayout } from '@murasoftware/next-core';
import Page from '../[...page]';
import { getMuraProps } from '@murasoftware/next-core';

export async function getServerSideProps(context) {

  const props = await getMuraProps(context,true,{expand:'categoryassignments'});

  return props;
}

function Edit(props) {
  const router = useRouter();

  return (
    <EditLayout {...props}>
      <Page {...props} route={`/${router.query.page}`} />
    </EditLayout>
  );
}

export default Edit;