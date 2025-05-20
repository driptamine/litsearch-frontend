import { useState } from "react";
import data from "./data.json";
import styled from "styled-components";
import { FaArrowDown } from "@react-icons/all-files/fa/FaArrowDown";

import { AutoCompleteContainer, AutoCompleteIcon, Input, AutoCompleteItem, AutoCompleteItemButton } from "./styles";

const Root = styled.div`
  position: relative;
  width: 320px;
`;

export const AutoComplete = ({ iconColor, style }) => {
  const [search, setSearch] = useState({
    text: "",
    suggestions: []
  });
  const [isComponentVisible, setIsComponentVisible] = useState(true);

  const onTextChanged = (e) => {
    const value = e.target.value;
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      suggestions = data.sort().filter((v) => regex.test(v.name));
    }
    setIsComponentVisible(true);
    setSearch({ suggestions, text: value });
  };

  const suggestionSelected = (value) => {
    setIsComponentVisible(false);

    setSearch({
      text: value.name,
      suggestions: []
    });
  };

  const { suggestions } = search;

  return (
    <Root style={style}>
      <div
        onClick={() => setIsComponentVisible(false)}
        style={{
          display: isComponentVisible ? "block" : "none",
          width: "200vw",
          height: "200vh",
          backgroundColor: "transparent",
          position: "fixed",
          zIndex: 0,
          top: 0,
          left: 0
        }}
      />
      <div>
        <Input
          id="input"
          autoComplete="off"
          value={search.text}
          onChange={onTextChanged}
          type={"text"}
        />
        <AutoCompleteIcon color={iconColor} isOpen={isComponentVisible}>
          <FaArrowDown />
        </AutoCompleteIcon>
      </div>
      {suggestions.length > 0 && isComponentVisible && (
        <AutoCompleteContainer>
          {suggestions.map((item) => (
            <AutoCompleteItem key={item.code}>
              <AutoCompleteItemButton
                key={item.code}
                onClick={() => suggestionSelected(item)}
              >
                {item.name}
              </AutoCompleteItemButton>
            </AutoCompleteItem>
          ))}
        </AutoCompleteContainer>
      )}
    </Root>
  );
};
