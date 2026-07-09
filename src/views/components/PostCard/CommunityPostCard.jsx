import React from 'react';
import { styled } from '@linaria/react';
import PostCard from 'views/components/PostCard/PostCard';

const CommunityPostCard = (props) => {
  const { post, ...rest } = props;
  const status = post.status;

  return (
    <Wrapper>
      {status && status !== 'approved' && (
        <StatusBadge status={status}>{status}</StatusBadge>
      )}
      <PostCard post={post} {...rest} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: capitalize;
  background: ${({ status }) =>
    status === 'pending' ? '#f0ad4e' :
    status === 'rejected' ? '#e74c3c' :
    '#888'};
  color: #fff;
`;

export default CommunityPostCard;
