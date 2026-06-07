import { styled } from '@linaria/react';

const dynamicStyles = props => `
  margin-left: ${props.gotsidebar ? '240px' : '0'};
  overflow: ${props.isChat ? 'hidden' : 'auto'};
  height: ${props.isChat ? 'calc(100vh - 5em)' : 'auto'};
`;

// Linaria container component
const BaseContainer = styled.div`
  box-sizing: border-box;
  flex: 1;
  width: auto;
  ${dynamicStyles}
  transition: margin-left 0.3s ease-in-out;

  padding-top: 5em;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 0em;

  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 70px;
    height: auto;
    overflow: auto;
  }
`;

export default BaseContainer;
