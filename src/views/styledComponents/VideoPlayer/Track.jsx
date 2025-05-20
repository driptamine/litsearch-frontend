import styled from "styled-components";

export const StyledTrack = styled.div`
  height: 4px;
  /* width: 20%; */
  /* width: ${props => props.value}%;  */
  width: ${props => props.progress}%;
  
  border-bottom-left-radius 12px;
  border-bottom-right-radius 12px;
  border-top-left-radius 12px;
  border-top-right-radius 12px;


  /* background-color: #5c48a2; purple */

  background-color: white;


  position: absolute;
  top: 50%;
  transform: translateY(-50%);


  -webkit-transition: width 0.9s ease;
  -o-transition: width 0.9 ease;
  transition: width 0.9 ease;

`;
