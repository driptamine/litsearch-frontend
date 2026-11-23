import React from 'react';
import classNames from 'classnames';


import PlayerButton from 'views/components/icon-button/PlayerButton';
import Icon from 'views/components/icon';

import './icon-button.css';


function IconButton({className, icon, label, onClick, type = 'button'}) {
  return (
    <PlayerButton
      className={classNames('btn--icon', `btn--${icon}`, className)}
      label={label}
      onClick={onClick}
      type={type}>
      <Icon name={icon} />
    </PlayerButton>
  );
}

export default IconButton;
