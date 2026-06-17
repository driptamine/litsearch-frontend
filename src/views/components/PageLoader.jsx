import React from 'react';
import { styled } from '@linaria/react';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--borderColor, #333);
  border-top-color: var(--accent, #e50914);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function PageLoader() {
  return (
    <LoaderWrapper>
      <Spinner />
    </LoaderWrapper>
  );
}

export default PageLoader;
