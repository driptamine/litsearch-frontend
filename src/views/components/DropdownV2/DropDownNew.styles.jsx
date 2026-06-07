import { styled } from '@linaria/react';
import themeVars from 'views/styles/theme-vars';

export const DropDownWrapper = styled.div`
  position: relative;
  width: auto;
  display: flex;
  align-items: center;
`;

export const DropDownButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  color: ${themeVars.text};

  &:focus {
    outline: none;
  }
`;

export const SVG = styled.svg`
  margin-left: 4px;
  height: 1rem;
  width: 1.2rem;
  fill: currentColor;
`;

export const OptionMenu = styled.div`
  transform-origin: top right;
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  background-color: ${themeVars.navBg};
  min-width: 180px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
  border-radius: 12px;
  padding: 8px 0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border: 1px solid ${themeVars.navBorderColor};

  &:focus {
    outline: none;
  }
`;

export const OptionRow = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  width: 100%;
  box-sizing: border-box;
  background-color: transparent;
  color: ${themeVars.text};

  &:hover {
    background-color: ${themeVars.sideBarHoverColor};
  }

  & + & {
    border-top: 1px solid ${themeVars.navBorderColor};
  }
`;

export const Label = styled.div`
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  width: 100%;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: ${themeVars.navBorderColor};
  margin: 4px 0;
`;

export const SvgTest = styled.button`
  width: 30px;
  height: 40px;
  border: none;
  background-color: transparent;

  /* background-color: blue; */
`;
