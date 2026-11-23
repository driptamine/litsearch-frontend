import React from 'react';
import { styled } from '@linaria/react';

const CardWrapper = styled.div`
  background-color: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
  transition: transform 0.2s, border-color 0.2s;
  color: inherit;

  &:hover {
    transform: translateY(-5px);
    border-color: #0084ff;
  }
`;

function PostCard({ children, className, ...props }) {
  return <CardWrapper className={className} {...props}>{children}</CardWrapper>;
}

export default PostCard;
