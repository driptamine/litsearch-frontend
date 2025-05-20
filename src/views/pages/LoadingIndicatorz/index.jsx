import React from 'react';
import ReactLoading from 'react-loading';
// import LoadingIndicator from 'views/components/LoadingIndicator';
import styled, { keyframes } from 'styled-components';

const breathing = keyframes`
    from {
      color: var(--textColor1);
    }
    to {
      color: var(--textColor2);
    }
`;

const StyledLoadingContainer = styled.div`
  display: grid;
  justify-content: center;
  justify-items: center;
  transition: all 2s linear ease-in;

  h1 {
    color: #dddddd;
    text-align: center;
    animation: 2s infinite alternate ease-out ${breathing};
  }
  p {
    color: var(--textColor2);
  }
`;

const H1 = styled.h1`
  text-shadow: 1px 1px #575757;
`;


const LoadingIndicatorz = ({ text, smallText, height = 150, width = 150, type = 'bars', style, color, }) => (
  <StyledLoadingContainer style={style || null}>
    <ReactLoading type={type} color={color || 'rgba(255,255,255,0.75)'} height={height} width={width} />
    {/*<LoadingIndicator />*/}

    {text && <H1>{text}</H1>}

    {smallText && <p>{smallText}</p>}
  </StyledLoadingContainer>
);

export default LoadingIndicatorz;
