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
  @keyframes slideUp {
    0% { transform: translateY(6px); opacity: 0; }
    60% { transform: translateY(-2px); opacity: 1; }
    100% { transform: translateY(0); opacity: 1; }
  }
  animation: slideUp 0.6s ease;
`;

export default Impressions;
