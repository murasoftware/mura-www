import React from 'react';
import { useRouter } from 'next/router';
import Page from '../_static/[...page]';
import { EditLayout, setMuraConfig, getMuraProps, getMura } from '@murasoftware/next-core';
import muraConfig from 'mura.config';

export const getServerSideProps = async (context) => {
  setMuraConfig(muraConfig);
  
  const Mura=getMura(context);
 
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