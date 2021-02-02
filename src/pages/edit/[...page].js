import React from 'react';
import { useRouter } from 'next/router';
import EditLayout from '@mura/core/EditLayout';
import Page from '../[...page]';
import { getMuraProps} from '@mura/core/Connector';

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