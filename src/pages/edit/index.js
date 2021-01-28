import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import EditLayout from '@mura/react/UI/EditLayout';
import Page from '../[...page]';
import { getMuraProps, getRootPath } from '@mura/react/MuraConnector';

export async function getServerSideProps(context) {
  const props = await getMuraProps(context,true,{expand:'crumbs,categoryassignments'});

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