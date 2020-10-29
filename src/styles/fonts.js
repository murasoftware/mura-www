import { css } from 'styled-components';

import IEXBold from '../fonts/IEX-Bold.woff';
import IEXBold2 from '../fonts/IEX-Bold.woff2';

import IEXStandard from '../fonts/IEX-Standard.woff';
import IEXStandard2 from '../fonts/IEX-Standard.woff2';

import IEXText from '../fonts/IEX-Text.woff';
import IEXText2 from '../fonts/IEX-Text.woff2';


const GlobalFonts = css`
  @font-face {
    font-family: 'IEX';
    src: url(${IEXStandard2}) format('woff2'), url(${IEXStandard}) format('woff');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'IEX';
    src: url(${IEXBold2}) format('woff2'), url(${IEXBold}) format('woff');
    font-weight: bold;
    font-style: normal;
  }

  @font-face {
    font-family: 'IEXBold';
    src: url(${IEXBold2}) format('woff2'), url(${IEXBold}) format('woff');
    font-weight: bold;
    font-style: normal;
  }

  
  @font-face {
    font-family: 'IEXText';
    src: url(${IEXText2}) format('woff2'), url(${IEXText}) format('woff');
    font-weight: normal;
    font-style: normal;
  }
`;
export default GlobalFonts;
