// REFERENCE https://codesandbox.io/u/gasper94

import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  DropDownWrapper,
  DropDownButton,
  SVG,
  OptionMenu,
  OptionRow,
  SvgTest,
  Label
} from "./DropDownNew.styles";
import SubMenu from "./SubMenu";
import styled from "styled-components";

import { fetchLogout } from "core/actions";

const ReDropDownButton = styled(DropDownButton)`
  cursor: pointer;
`;
const ThemeSwitcher = styled.div`
  display: flex;
`;
function DropDownNew({ defaultText = "", options = [], changeOptionName, className }) {
  const dispatch = useDispatch();

  const [actionDropDown, setActionDropDown] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const dropdownEl = useRef(null);
  const [mainDefaultText, setMainDefaultText] = useState(defaultText);

  const dropdown = () => {
    setActionDropDown(!actionDropDown);
  };

  const handleClickClose = (event) => {
    const path = event.composedPath();

    let isClickInside = path.find((element) => element === dropdownEl.current);

    if (isClickInside === undefined) {
      if (actionDropDown) {
        setActionDropDown(false);
      }
    }
  };

  // const selectOption = (option) => {
  //   setActionDropDown(false);
  // };

  // const selectOutsideOption = (classId) => {
  //   changeOptionName(classId);
  //   selectOption();
  // };

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
    // handleClickClose()
    setActionDropDown(false);
    setIsShown(false);
  }
  return (
    <DropDownWrapper>
      <div ref={dropdownEl}>
        <ReDropDownButton onClick={dropdown} style={{cursor: 'pointer'}}>
          {mainDefaultText}
        </ReDropDownButton>

        <DropDownWrapper>
          {actionDropDown ? (
            <>
              <OptionMenu role="menu">
                {options.map((option, key) => (
                  <OptionRow>
                    <Label>{`${option}`}</Label>

                  </OptionRow>
                ))}

                <ThemeSwitcher>
                  <OptionRow>
                    <Label>Dark</Label>
                  </OptionRow>
                  <OptionRow>
                    <Label>Light</Label>
                  </OptionRow>
                </ThemeSwitcher>

                <OptionRow>

                  <Label onClick={handleLogOut}>LOGOUT</Label>
                </OptionRow>

              </OptionMenu>
            </>
          ) : null}
          {isShown ? (
            <Content>I'll appear when you hover over the button.</Content>
          ) : null}
        </DropDownWrapper>
      </div>
    </DropDownWrapper>
  );
}

export default DropDownNew;

export const Content = styled.div`
  position: relative;
  height: 50px;
  right: -300px;
  top: 200px;
  background-color: blue;
  z-index: 40;
`;
