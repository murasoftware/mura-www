import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '../scss/custom.scss'
//import MuraConfig from 'mura.config';
import React from "react";

export default function MuraApp({ Component, pageProps }) {

  return  (
    <Component {...pageProps} />
  )
}