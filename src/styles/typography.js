import { tablet, mobile } from '../utils/breakpoints';

// const remMixin = (size) => `calc(${size} / 16)rem;`;
/**
 * br
 * @param {*} maxSize Mzx
 * @param {*} minSize min
 * @returns {string} String
 */
// const remMixin = (maxSize, minSize) => `font-size: ${maxSize}px`;
//   // `font-size: calc(${minSize}px + (${maxSize} - ${minSize}) * ((100vw - 300px) / (1920 - 300)));`;

export const iexStandard = `
  font-family: 'IEX';
`;

export const iexBold = `
  font-family: 'IEXBold';
`;

export const iexText = `
  font-family: 'IEXText';
`;

export const font140 = `
  font-size: 140px;
  line-height: 1.1;

  @media (max-width: ${tablet.max}px) {
    font-size: 100px;
  }

  @media (max-width: ${mobile.max}px) {
    font-size: 60px;
    line-height: 1;
  }

`;

export const font60 = `
  font-size: 60px;
  line-height: 1.1;
  
  @media (max-width: ${tablet.max}px) {
    font-size: 50px;
  }

  @media (max-width: ${mobile.max}px) {
    font-size: 40px;
    line-height: 1;
  }

`;

export const font30 = `
  font-size: 30px;
  line-height: 1.1;
  
  @media (max-width: ${tablet.max}px) {
    font-size: 30px;
  }

  @media (max-width: ${mobile.max}px) {
    font-size: 20px;
    line-height: 1;
  }
`;

export const font20 = `
  font-size: 20px;
  line-height: 1.1;
  
  @media (max-width: ${tablet.max}px) {
    font-size: 20px;
  }

  @media (max-width: ${mobile.max}px) {
    font-size: 20px;
    line-height: 1;
  }
`;

export const font16 = `
  font-size: 16px;
  line-height: 1.1;
  
  @media (max-width: ${tablet.max}px) {
    font-size: 16px;
  }

  @media (max-width: ${mobile.max}px) {
    font-size: 16px;
    line-height: 1;
  }
`;
