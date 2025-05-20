import styled from "styled-components";

export const StyledRail = styled.div`
  height: 4px;
  width: 100%;

  border-bottom-left-radius 12px;
  border-bottom-right-radius 12px;
  border-top-left-radius 12px;
  border-top-right-radius 12px;

  /* background-color: rgb(89 89 89); */
  background-color: white;

  opacity: 0.38;


  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;
