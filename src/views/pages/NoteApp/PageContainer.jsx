import React from "react";
import PageTitle from "./PageTitle";
import Block from "./Block";
import { TableBlock, tryParseTable } from "./TableBlock";
import TagInput from "./TagInput";
import { PageContainerWrapper, LoadingText, Toolbar, ToolbarBtn } from "./styledComponents";

const PageContainer = ({
  title,
  setTitle,
  blocks,
  updateBlock,
  handleKeyDown,
  refs,
  pageLoading,
  tags,
  onAddTag,
  onRemoveTag,
  onInsertTable,
}) => {
  if (pageLoading) return <PageContainerWrapper><LoadingText>Loading page...</LoadingText></PageContainerWrapper>;

  const isTable = (block) => tryParseTable(block.content) !== null;

  return (
    <PageContainerWrapper>
      <Toolbar>
        <ToolbarBtn onClick={onInsertTable} title="Insert table">Table</ToolbarBtn>
      </Toolbar>
      <TagInput tags={tags} onAdd={onAddTag} onRemove={onRemoveTag} />
      <PageTitle value={title} onChange={setTitle} />

      {blocks.map((block, index) =>
        isTable(block) ? (
          <TableBlock
            key={block._id}
            index={index}
            content={block.content}
            updateBlock={updateBlock}
          />
        ) : (
          <Block
            key={block._id}
            index={index}
            value={block.content}
            updateBlock={updateBlock}
            handleKeyDown={handleKeyDown}
            refCallback={(el) => (refs.current[index] = el)}
          />
        )
      )}
    </PageContainerWrapper>
  );
};

export default PageContainer;
