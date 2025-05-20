import styled from "styled-components";

export const StyledThumbWrapper = styled.span`

  position: absolute;
  width: 15px;
  height: 15px;
  box-sizing: border-box;
  border-radius: 50%;
  outline: 0px;
  background-color: currentcolor;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, bottom 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  top: 50%;
  transform: translate(-50%, -50%);
`;
