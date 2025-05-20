import styled from "styled-components";

export const DropDownWrapper = styled.div`
  position: relative;
  width: 100px;
  
`;

export const DropDownButton = styled.div`

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* background-color: white; */

  border-width: 1px;
  border-radius: 0.375rem;
  --tw-border-opacity: 1;
  border-color: rgba(209, 213, 219, var(--tw-border-opacity));

  padding: 0.5rem;

  /* Font */
  font-size: 1rem;
  /* line-height: 1.4rem; */
  --tw-text-opacity: 1;
  color: rgba(55, 65, 81, var(--tw-text-opacity));

  /* Shadow */
  --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

  &:focus {
    outline: none;
  }

  &:hover {
    --tw-bg-opacity: 1;
    /* background-color: rgba(249, 250, 251, var(--tw-bg-opacity)); */
  }
`;

export const SVG = styled.svg`
  margin-left: 4px;
  height: 1rem;
  width: 1.2rem;
`;

export const OptionMenu = styled.div`

  transform-origin: top bottom;
  position: absolute;
  right: 23px;
  top: 20px;
  background-color: white;
  margin-top: -0.5rem;
  /* margin-right: -0.25rem; */
  width: 140px;
  max-height: 18rem;
  overflow: hidden;
  z-index: 40;

  /* Shadow */
  --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

  border-width: 0.5px;
  border-style: solid;
  border-radius: 0.375rem;
  --tw-border-opacity: 1;
  border-color: rgba(209, 213, 219, var(--tw-border-opacity));

  &:hover {
    outline: none;
  }
`;

export const OptionRow = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;

  background-color: white;

  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  border-style: solid;
  --tw-border-opacity: 1;
  border-color: rgba(209, 213, 219, var(--tw-border-opacity));

  &:hover {
    background-color: #73aed4;
  }
`;

export const Label = styled.label`
  cursor: pointer;
  display: block;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  /* background-color: pink; */
  /* Font */
  font-size: 0.875rem;
  line-height: 1.25rem;

  --tw-text-opacity: 1;
  color: rgba(55, 65, 81, var(--tw-text-opacity));
`;

export const SvgTest = styled.button`
  width: 30px;
  height: 40px;
  border: none;
  background-color: transparent;

  /* background-color: blue; */
`;
