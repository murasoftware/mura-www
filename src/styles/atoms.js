import { styled} from 'styled-components';
import { font140, font60, font30, font20, iexStandard, iexBold } from './typography';

export const H1 = styled.h1`
  ${iexStandard}
  ${font140}
`;

export const H2 = styled.h2`
  ${iexStandard}
  ${font60}
`;

export const H3 = styled.h3`
  ${iexStandard}
  ${font30}
`;

export const H4 = styled.h4`
  ${iexBold}
  ${font20}
`;

export const GridContainer = styled.div`
  display: grid;
  grid-column-gap: 40px;
`;

