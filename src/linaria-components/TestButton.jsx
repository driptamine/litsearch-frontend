import React from 'react';
import { styled } from '@linaria/react';

export const TestButton = styled.button`
  background-color: var(--card-color);
  color: var(--text-color);
  border: 1px solid var(--title-color);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--title-color);
    color: white;
  }
`;
