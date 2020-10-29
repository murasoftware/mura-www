import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '../scss/custom.scss'

import React, { useState } from "react";
import GlobalContext from '../components/GlobalContext'

export default function MuraApp({ Component, pageProps }) {
  const [isEditMode, setIsEditMode] = useState(false);
  
return <GlobalContext.Provider value={[isEditMode, setIsEditMode]}>
              <Component {...pageProps} />
          </GlobalContext.Provider>
}