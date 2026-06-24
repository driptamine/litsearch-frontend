import React from 'react';
import { styled } from '@linaria/react';
import { FaEye } from 'react-icons/fa';

const Impressions = ({ count = 0 }) => (
  <ImpressionsWrap>
    <StyledFaEye />
    <Count key={count}>{count}</Count>
  </ImpressionsWrap>
);

const ImpressionsWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #888;
  font-size: 0.85rem;
`;

const StyledFaEye = styled(FaEye)`
  font-size: 14px;
`;

const Count = styled.span`
  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); color: #0f6; }
    100% { transform: scale(1); }
  }
  animation: pop 0.35s ease;
`;

export default Impressions;
