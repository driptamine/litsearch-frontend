import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const LikeIcon = ({ size = 18, color = 'currentColor', fill = 'none', hoverColor, ...others }) => {
  if (fill !== 'none') {
    return <FaHeart size={size} color={color} {...others} />;
  }
  return <FaRegHeart size={size} color={color} {...others} />;
};

export default LikeIcon;
