import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '../scss/custom.scss'
//import MuraConfig from 'mura.config';
import React, { useState } from "react";
import { EditContext, MuraContext} from '@murasoftware/next-core'
import MuraConfig  from 'mura.config'

export default function MuraApp({ Component, pageProps }) {
  const [isEditMode, setIsEditMode] = useState(false);
  return  (
    <MuraContext.Provider value={MuraConfig}>
      <EditContext.Provider value={[isEditMode, setIsEditMode]}> 
          <Component {...pageProps} />
      </EditContext.Provider>
    </MuraContext.Provider>
  )
}