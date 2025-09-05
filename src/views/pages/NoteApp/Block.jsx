import React from "react";
import { BlockWrapper, BlockTextarea } from "./styledComponents";

const Block = ({
  index,
  value,
  updateBlock,
  handleKeyDown,
  handlePaste,
  refCallback,
  focusedIndex,
  setFocusedIndex,
}) => {

  return (
    <BlockWrapper>
      <BlockTextarea
        ref={refCallback}
        // dangerouslySetInnerHTML={{ __html: value }}

        contentEditable
        suppressContentEditableWarning
        onInput={(e) => updateBlock(index, e.currentTarget.textContent)}
        onKeyDown={(e) => handleKeyDown(e, index)}

        onPaste={(e) => handlePaste(e, index)}

        data-placeholder={focusedIndex === index ? "Type '/' for commands" : ""}
        onFocus={() => setFocusedIndex(index)}
        onBlur={() => setFocusedIndex(null)}
      >
      
      </BlockTextarea>
    </BlockWrapper>
  );
};

export default Block;
