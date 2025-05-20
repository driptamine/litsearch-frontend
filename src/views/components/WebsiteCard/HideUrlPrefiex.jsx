import React from 'react';

const HideUrlPrefix = ({ url }) => {
  const displayUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');

  return (
    <a href={url}>{displayUrl}</a>
  );
};

export default HideUrlPrefix;
