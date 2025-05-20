import React, { useEffect, useState } from "react";
import {
  OptionRow,
  Label,
  SvgTest,
  DropDownWrapper
} from "./DropDownNew.styles";
import styled from "styled-components";

function SubMenu(props, {className}) {
  const [isShown, setIsShown] = useState(true);
  // const [actionDropDown, setActionDropDown] = useState(false);
  // const dropdownEl = useRef(null);
  // const [mainDefaultText, setMainDefaultText] = useState(null);

  // const dropdown = () => {
  //   setActionDropDown(!actionDropDown);
  // };

  // const handleClickClose = (event) => {
  //   const path = event.composedPath();

  //   let isClickInside = path.find((element) => element === dropdownEl.current);

  //   if (isClickInside === undefined) {
  //     if (actionDropDown) {
  //       setActionDropDown(false);
  //     }
  //   }
  // };

  // const selectOption = (option) => {
  //   setActionDropDown(false);
  // };

  // const selectOutsideOption = (classId) => {
  //   changeOptionName(classId);
  //   selectOption();
  // };

  // // Set Default Text on Button
  // useEffect(() => {
  //   setMainDefaultText(defaultText);
  // }, [defaultText]);

  // // Click event listener to close dropdown
  // useEffect(() => {
  //   document.addEventListener("mouseup", handleClickClose);
  //   return () => {
  //     document.removeEventListener("mouseup", handleClickClose);
  //   };
  // });

  // useEffect(() => {
  //   document.addEventListener("mouseover", console.log("hey"));
  //   return () => {
  //     document.removeEventListener("mouseover", console.log("hey"));
  //   };
  // });

  return (
    <DropDownWrapper>
      <OptionRow onClick={() => setIsShown(!isShown)}>
        <Label>{`${props.children}`}</Label>
        <SvgTest
          onMouseEnter={() => setIsShown(true)}
          onMouseLeave={() => setIsShown(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </SvgTest>
      </OptionRow>

      {isShown ? (
        <Content>I'll appear when you hover over the button.</Content>
      ) : null}
    </DropDownWrapper>
  );
}

export default SubMenu;

export const Content = styled.div`
  position: absolute;
  right: -100px;
  top: 52px;
`;

// export const ContentOther = styled.div`
//   background-color: blue;
//   width: 32px;
//   height: 32px;
// `;
