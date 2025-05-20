import styled from "styled-components";

export const StyledBox = styled.div`
  /* display: flex; */
  /* display: grid; */
  display: ${props => props.display ? props.display : 'grid'};
`;
