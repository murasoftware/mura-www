import React from 'react';
import { useRouter } from 'next/router';
import Page from '../_static/[[...page]]';
import { EditLayout, getMuraProps } from '@murasoftware/next-core';
import {getConfiguredMura} from 'mura.config.js';

export const getServerSideProps = async (context) => {

  const Mura=await getConfiguredMura(context);
  
  const props= await getMuraProps(
    {
      context:context,
      Mura:Mura,
      renderMode:'dynamic',
      params: {
          expand:'categoryassignments'
      }
    }
  );
  
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