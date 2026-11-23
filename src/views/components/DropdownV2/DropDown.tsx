// REFERENCE https://codesandbox.io/u/gasper94

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  DropDownWrapper,
  DropDownButton,
  SVG,
  OptionMenu,
  OptionRow,
  SvgTest,
  Label,
  Divider
} from './DropDownNew.styles';
import SubMenu from './SubMenu';
import { styled } from '@linaria/react';

import { fetchLogout } from 'core/actions';

const ReDropDownButton = styled(DropDownButton)`
  cursor: pointer;
`;
function DropDownNew({ defaultText = "", options = [], accounts = [], activeAccountId, onOptionClick, onAccountSwitch, changeOptionName, className }) {
  const dispatch = useDispatch();

  const [actionDropDown, setActionDropDown] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const dropdownEl = useRef(null);
  const [mainDefaultText, setMainDefaultText] = useState(defaultText);

  const dropdown = () => {
    setActionDropDown(!actionDropDown);
    setShowAccounts(false);
  };

  const handleClickClose = (event) => {
    const path = event.composedPath();

    let isClickInside = path.find((element) => element === dropdownEl.current);

    if (isClickInside === undefined) {
      if (actionDropDown) {
        setActionDropDown(false);
        setShowAccounts(false);
      }
    }
  };

  const handleOptionClick = (option) => {
    if (option === 'Switch Accounts') {
      setShowAccounts(true);
    } else {
      if (onOptionClick) {
        onOptionClick(option);
      }
      setActionDropDown(false);
    }
  };

  const handleAccountClick = (accountId) => {
    if (onAccountSwitch) {
      onAccountSwitch(accountId);
    }
    setActionDropDown(false);
    setShowAccounts(false);
  };

  // Set Default Text on Button
  useEffect(() => {
    setMainDefaultText(defaultText);
  }, [defaultText]);

  // Click event listener to close dropdown
  useEffect(() => {
    document.addEventListener("mouseup", handleClickClose);
    return () => {
      document.removeEventListener("mouseup", handleClickClose);
    };
  });
  function handleLogOut(){
    dispatch(fetchLogout())
    setActionDropDown(false);
    setShowAccounts(false);
  }
  return (
    <DropDownWrapper className={className}>
      <div ref={dropdownEl}>
        <ReDropDownButton onClick={dropdown}>
          {mainDefaultText}
        </ReDropDownButton>

        {actionDropDown && (
          <OptionMenu role="menu">
            {!showAccounts ? (
              <>
                {options.map((option, key) => (
                  <OptionRow key={key} onClick={() => handleOptionClick(option)}>
                    <Label>{option}</Label>
                  </OptionRow>
                ))}

                <Divider />
                <OptionRow onClick={() => handleOptionClick('Dark Theme')}>
                  <Label>Dark</Label>
                </OptionRow>
                <OptionRow onClick={() => handleOptionClick('Light Theme')}>
                  <Label>Light</Label>
                </OptionRow>

                <OptionRow onClick={handleLogOut}>
                  <Label>LOGOUT</Label>
                </OptionRow>
              </>
            ) : (
              <>
                <OptionRow onClick={() => setShowAccounts(false)}>
                  <Label>← Back</Label>
                </OptionRow>
                {accounts.map((account) => (
                  <OptionRow 
                    key={account.id} 
                    onClick={() => handleAccountClick(account.id)}
                    style={{ backgroundColor: account.id === activeAccountId ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                  >
                    <Label>{account.username || account.email || account.id}</Label>
                    {account.id === activeAccountId && <span style={{ marginLeft: 'auto', fontSize: '12px' }}>✓</span>}
                  </OptionRow>
                ))}
                <OptionRow onClick={() => handleOptionClick('Add Account')}>
                  <Label>+ Add Account</Label>
                </OptionRow>
              </>
            )}
          </OptionMenu>
        )}
      </div>
    </DropDownWrapper>
  );
}

export default DropDownNew;
