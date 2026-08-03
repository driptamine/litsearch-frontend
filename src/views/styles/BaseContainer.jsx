import { styled } from '@linaria/react';

// `flush` removes padding and fills the viewport below the fixed header (60px).
// Used by immersive full-screen pages such as /maps.
const dynamicStyles = props => `
  overflow: ${props.isChat || props.flush ? 'hidden' : 'auto'};
  height: ${props.isChat ? '100%' : props.flush ? 'calc(100vh - 60px)' : 'auto'};
  margin-top: ${props.flush ? '-20px' : '0'};
  padding-left: ${props.flush ? '0' : '1em'};
  padding-right: ${props.flush ? '0' : '1em'};
`;

// Linaria container component
const BaseContainer = styled.div`
  box-sizing: border-box;
  flex: 1;
  width: auto;
  ${dynamicStyles}

  padding-bottom: 0em;

  @media screen and (max-width: 768px) {
    padding-left: 0;
    padding-right: 0;
    padding-top: ${({ flush }) => (flush ? '0' : '10px')};
    height: ${({ flush }) => (flush ? 'calc(100vh - 70px)' : 'auto')};
    margin-top: 0;
    overflow: ${({ flush }) => (flush ? 'hidden' : 'auto')};
  }
`;

export default BaseContainer;
