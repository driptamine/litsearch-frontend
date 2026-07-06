import React from "react";
import PageTitle from "./PageTitle";
import Block from "./Block";
import TagInput from "./TagInput";
import { PageContainerWrapper, LoadingText } from "./styledComponents";

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
}) => {
  if (pageLoading) return <PageContainerWrapper><LoadingText>Loading page...</LoadingText></PageContainerWrapper>;

  return (
    <PageContainerWrapper>
      <TagInput tags={tags} onAdd={onAddTag} onRemove={onRemoveTag} />
      <PageTitle value={title} onChange={setTitle} />

      {blocks.map((block, index) => (
        <Block
          key={block._id}
          index={index}
          value={block.content}
          updateBlock={updateBlock}
          handleKeyDown={handleKeyDown}
          refCallback={(el) => (refs.current[index] = el)}
        />
      ))}
    </PageContainerWrapper>
  );
};

export default PageContainer;
