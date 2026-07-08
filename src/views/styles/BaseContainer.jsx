import { styled } from '@linaria/react';

const dynamicStyles = props => `
  overflow: ${props.isChat ? 'hidden' : 'auto'};
  height: ${props.isChat ? '100%' : 'auto'};
`;

// Linaria container component
const BaseContainer = styled.div`
  box-sizing: border-box;
  flex: 1;
  width: auto;
  ${dynamicStyles}

  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 0em;

  @media screen and (max-width: 768px) {
    padding-left: 0;
    padding-right: 0;
    padding-top: 10px;
    height: auto;
    overflow: auto;
  }
`;

export default BaseContainer;
