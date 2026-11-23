import React, { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import { BlockWrapper, BlockTextarea, BlockPreview } from "./styledComponents";
import LatexRenderer from "./LatexRenderer";

const hasLatex = (text) => text.includes('$');

const TABLE_CMD = "/table";

const Block = ({
  index,
  value,
  updateBlock,
  handleKeyDown,
  refCallback,
  onInsertTableAt,
}) => {
  const internalRef = useRef(null);

  const setRef = (el) => {
    internalRef.current = el;
    if (refCallback) refCallback(el);
  };

  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.trim() === TABLE_CMD) {
      updateBlock(index, '');
      if (onInsertTableAt) onInsertTableAt(index);
      return;
    }
    updateBlock(index, val);
  };

  return (
    <BlockWrapper>
      <BlockTextarea
        ref={setRef}
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyDown(e, index)}
        placeholder="Type here..."
      />
      {hasLatex(value) && (
        <BlockPreview>
          <LatexRenderer text={value} />
        </BlockPreview>
      )}
    </BlockWrapper>
  );
};

export default Block;
