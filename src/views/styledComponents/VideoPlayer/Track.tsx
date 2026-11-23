import { styled } from '@linaria/react';

const trackStyles = props => `
  width: ${props.progress || 0}%;
`;

export const StyledTrack = styled.div`
  height: 4px;
  ${trackStyles}
  
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;


  /* background-color: #5c48a2; purple */

  background-color: white;


  position: absolute;
  top: 50%;
  transform: translateY(-50%);


  -webkit-transition: width 0.9s ease;
  -o-transition: width 0.9s ease;
  transition: width 0.9s ease;

`;
