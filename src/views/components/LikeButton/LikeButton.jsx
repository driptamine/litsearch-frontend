import React from 'react';
import { styled } from '@linaria/react';
import LikeIcon from 'views/components/LikeIcon';
import { white, likeColor } from 'views/style/colors';

const LikeButton = ({ 
  isLiked, 
  likesCount, 
  onClick, 
  size = 18, 
  showCount = true,
  activeColor = likeColor,
  inactiveColor = '#71767b',
  hoverColor = '#1d9bf0'
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <LikeWrapper 
      onClick={handleClick} 
      active={isLiked} 
      activeColor={activeColor}
      hoverColor={hoverColor}
      inactiveColor={inactiveColor}
    >
      <LikeIcon 
        size={size} 
        color={isLiked ? activeColor : 'currentColor'} 
        fill={isLiked ? activeColor : 'none'}
      />
      {showCount && <LikesCounter>{likesCount || 0}</LikesCounter>}
    </LikeWrapper>
  );
};

const likeWrapperStyles = props => `
  color: ${props.active ? props.activeColor : props.inactiveColor};
  &:hover {
    color: ${props.hoverColor};
  }
`;

const LikeWrapper = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  ${likeWrapperStyles}
  transition: all 0.2s;
  padding: 4px 8px;
  border-radius: 20px;

  &:hover {
    background-color: rgba(29, 155, 240, 0.1);
  }

  svg {
    transition: transform 0.2s;
  }

  &:active svg {
    transform: scale(1.2);
  }
`;

const LikesCounter = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
`;

export default LikeButton;
