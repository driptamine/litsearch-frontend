import styled from "styled-components";

export const StyledThumb = styled.input`

  border: 1px;

  height: 10px;
  width: 10px;
  border-radius: 50%;
  clip: rect(0px, 0px, 0px, 0px);
  padding: 0;
  /* position: absolute; */
`;

export const StyledThumbMUI = styled.input`

  border: 0px;
  clip: rect(0px, 0px, 0px, 0px);

  height: 100%;
  width: 100%;

  height: 10px;
  width: 10px;


  margin: -1px;
  overflow: hidden;
  padding: 0px;

  /* position: absolute; */
  white-space: nowrap;

  direction: ltr;

`;
