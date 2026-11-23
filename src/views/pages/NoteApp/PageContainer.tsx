import React from "react";
import PageTitle from "./PageTitle";
import Block from "./Block";
import TableBlock from "./TableBlock";
import TagInput from "./TagInput";
import { PageContainerWrapper, Toolbar, ToolbarBtn } from "./styledComponents";

const PageContainer = ({
  title,
  setTitle,
  blocks,
  updateBlock,
  handleKeyDown,
  refs,
  tags,
  onAddTag,
  onRemoveTag,
  onInsertTable,
  onTableChange,
  onInsertTableAt,
}) => {
  return (
    <PageContainerWrapper>
      <Toolbar>
        <ToolbarBtn onClick={onInsertTable} title="Insert table">Table</ToolbarBtn>
      </Toolbar>
      <TagInput tags={tags} onAdd={onAddTag} onRemove={onRemoveTag} />
      <PageTitle value={title} onChange={setTitle} />

      {blocks.map((block, index) =>
        block.type === 'table' ? (
          <TableBlock
            key={block._id}
            index={index}
            columns={block.tableData?.columns || ["Column 1", "Column 2"]}
            rows={block.tableData?.rows || [["", ""]]}
            onTableChange={onTableChange}
          />
        ) : (
          <Block
            key={block._id}
            index={index}
            value={block.content}
            updateBlock={updateBlock}
            handleKeyDown={handleKeyDown}
            refCallback={(el) => (refs.current[index] = el)}
            onInsertTableAt={onInsertTableAt}
          />
        )
      )}
    </PageContainerWrapper>
  );
};

export default PageContainer;
