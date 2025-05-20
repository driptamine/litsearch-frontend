// REFERENCE https://codesandbox.io/s/rough-currying-uqlle?file=/src/App.js:0-2458
import React from "react";
import styled from "styled-components";

import * as SC from 'views/styledComponents';
// import { StyledSlider } from 'views/styledComponents';

const image = "https://www.gravatar.com/avatar/cd7f6cc42c46c3a65c58ff594d962597?s=48&d=identicon&r=PG&f=1";
const thumb = {
  width: 54,
  height: 26
};

const height = 36;
const trackHeight = 6;

// colours
const lowerBackground = `linear-gradient(to bottom, yellow, yellow) 100% 50% / 100% ${trackHeight / 2}px no-repeat transparent`;

const makeLongShadow = (color, size) => {
  // Colors the slider to the right of the thumbpiece
  let i = 18;
  let shadow = `${i}px 0 0 ${size} ${color}`;

  for (; i < 1950; i++) {
    //If i is a small number, like 720, then when the slider gets set to its minimum, the end of the slider is the color for the left side of the slider, when it should be the colour for the right side
    shadow = `${shadow}, ${i}px 0 0 ${size} ${color}`;
  }

  return shadow;
};

const StyledSlider = styled.input`
  overflow: hidden;
  appearance: none;
  height: ${height}px;
  cursor: pointer;
  border-radius: 50%;
  marginbottom: 0;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: ${height}px;
    background: ${lowerBackground};
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none;
    height: ${thumb.height}px;
    width: ${thumb.width}px;
    background: url(${image});
    background-size: cover;
    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow("#AAAAAA", "-12px")};
    transition: background-color 150ms;
  }

  &::-moz-range-progress {
    background: ${lowerBackground};
  }

  &::-moz-range-thumb {
    appearance: none;
    margin: 0;
    height: ${thumb.height}px;
    width: ${thumb.height}px;
    background: url(${image});
    border: 0;
    transition: background-color 150ms;
  }

  &::-ms-track {
    width: 100%;
    height: ${height}px;
    border: 0;
    /* color needed to hide track marks */
    color: transparent;
    background: transparent;
  }

  &::-ms-fill-lower {
    background: ${lowerBackground};
  }

  &::-ms-thumb {
    appearance: none;
    height: ${thumb.height}px;
    width: ${thumb.height}px;
    background: url(${image});
    border-radius: 100%;
    border: 0;
    transition: background-color 150ms;
    /* IE Edge thinks it can support -webkit prefixes */
    top: 0;
    margin: 0;
    box-shadow: none;
  }
`;

export default (props) => {
  <SC.Slider type="range" {...props} />;
  // <StyledSlider type="range" {...props} />;
}
