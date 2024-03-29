import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@murasoftware/next-core-assets/dist/mura.10.min.css";
import "@murasoftware/next-core-assets/dist/mura.10.skin.css";
import '../scss/custom.scss'


import React from "react";

export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    console.log(metric) // The metric object ({ id, name, startTime, value, label }) is logged to the console
  }
}

export default function MuraApp({ Component, pageProps }) {

  return  (
    <Component {...pageProps} />
  )
}