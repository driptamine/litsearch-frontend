import React from 'react';
import { styled } from '@linaria/react';
import { FaEye } from 'react-icons/fa';

const Impressions = ({ count = 0 }) => (
  <ImpressionsWrap>
    <StyledFaEye />
    <span>{count}</span>
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

export default Impressions;
