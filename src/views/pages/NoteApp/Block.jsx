import React from "react";
import { BlockWrapper, BlockTextarea } from "./styledComponents";

const Block = ({
  index,
  value,
  updateBlock,
  handleKeyDown,
  refCallback,
  focusedIndex,
  setFocusedIndex,
}) => {
  return (
    <BlockWrapper>
      <BlockTextarea
        ref={refCallback}
        value={value}
        onChange={(e) => updateBlock(index, e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        placeholder={focusedIndex === index ? "Type '/' for commands" : ""}
        rows={1}
        onFocus={() => setFocusedIndex(index)}
        onBlur={() => setFocusedIndex(null)}
      />
    </BlockWrapper>
  );
};

export default Block;
