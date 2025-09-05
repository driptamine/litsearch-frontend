import React from "react";
import PageTitle from "./PageTitle";
import Block from "./Block";
import { PageContainerWrapper } from "./styledComponents";

const PageContainer = ({
  title,
  setTitle,
  blocks,
  updateBlock,
  handleKeyDown,
  handlePaste,
  refs,
  focusedIndex,
  setFocusedIndex,
}) => {
  return (
    <PageContainerWrapper>
      <PageTitle value={title} onChange={(e) => setTitle(e.target.value)} />

      {blocks.map((block, index) => (
        <Block
          key={index}
          index={index}
          value={block}
          updateBlock={updateBlock}
          handleKeyDown={handleKeyDown}
          handlePaste={handlePaste}
          refCallback={(el) => (refs.current[index] = el)}
          focusedIndex={focusedIndex}
          setFocusedIndex={setFocusedIndex}
        />
      ))}
    </PageContainerWrapper>
  );
};

export default PageContainer;
