import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const DropdownPortal = ({ isOpen, toggleDropdown, dropdownContent }) => {
  const dropdownRoot = document.getElementById('dropdown-root');

  if (!isOpen || !dropdownRoot) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="dropdown-portal">
      <div className="dropdown-overlay" onClick={toggleDropdown}></div>
      <div className="dropdown-content">{dropdownContent}</div>
    </div>,
    dropdownRoot
  );
};

export default DropdownPortal;
