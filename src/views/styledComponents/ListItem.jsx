import styled from "styled-components";

export const StyledListItem = styled.li`
   /* display: ${props => props.flex && 'flex'} */

   display: flex;

  ${props => props.hover && `
    &:hover {
      /* background-color: rgba(255, 255, 255, 0.1); */
      background-color: rgb(92 92 92 / 10%);
      /* background-color: ${props => props.theme.sideBarHoverColor}; */
    }
    cursor: pointer;
  `}
`;
