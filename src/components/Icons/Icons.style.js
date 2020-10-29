import { styled } from 'styled-components';

export const ArrowSVG = styled.svg`
  opacity: ${props => (props.isActive ? '1' : 0.5)};
`;
