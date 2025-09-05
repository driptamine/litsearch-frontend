import React, { useState, useRef, useEffect } from "react";
import { AppContainer, BlockWrapper, BlockTextarea, SidebarContainer, PageTitleInput } from "./styledComponents";

const PageTitle = ({ value, onChange }) => {
  return <PageTitleInput value={value} onChange={onChange} />;
};

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
      {value}
      </BlockTextarea>
    </BlockWrapper>
  );
};

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

const Sidebar = () => {
  return (
    <SidebarContainer>
      {[...Array(20)].map((_, i) => (
        <React.Fragment key={i}>
          <h3>Workspace</h3>
          <p>My Page</p>
        </React.Fragment>
      ))}
    </SidebarContainer>
  );
};

const NoteTakingApp = () => {
  const [title, setTitle] = useState("New page");
  const [blocks, setBlocks] = useState([""]);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const refs = useRef([]);
  const cursorInfo = useRef({ blockIndex: null, position: null });


  const updateBlock = (index, value) => {
    const newBlocks = [...blocks];
    newBlocks[index] = value;
    setBlocks(newBlocks);
  };

  const handleKeyDown = (e, index) => {
    const blockRef = refs.current[index];
    let cursorPos = 0;

    if (blockRef) {
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
        const range = selection.getRangeAt(0);
        cursorPos = range.startOffset;
      }
    }

    const currentText = blocks[index];

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const beforeCursor = currentText.slice(0, cursorPos);
      const afterCursor = currentText.slice(cursorPos);

      const newBlocks = [...blocks];
      newBlocks[index] = beforeCursor;
      newBlocks.splice(index + 1, 0, afterCursor);

      setBlocks(newBlocks);
      cursorInfo.current = { blockIndex: index + 1, position: 0 };
    } else if (e.key === "Backspace" && cursorPos === 0 && index > 0) {
      e.preventDefault();

      const newBlocks = [...blocks];
      const previousBlock = newBlocks[index - 1];
      const currentBlock = newBlocks[index];

      newBlocks[index - 1] = previousBlock + currentBlock;
      newBlocks.splice(index, 1);

      setBlocks(newBlocks);
      cursorInfo.current = {
        blockIndex: index - 1,
        position: previousBlock.length,
      };
    } else if (e.key === "ArrowUp") {
      if (cursorPos === 0 && index > 0) {
        e.preventDefault();
        const prevBlock = blocks[index - 1];
        cursorInfo.current = {
          blockIndex: index - 1,
          position: prevBlock.length,
        };
        setBlocks([...blocks]); // Trigger re-render
      }
    } else if (e.key === "ArrowDown") {
      if (cursorPos === currentText.length && index < blocks.length - 1) {
        e.preventDefault();
        cursorInfo.current = {
          blockIndex: index + 1,
          position: 0
        };
        setBlocks([...blocks]); // Trigger re-render
      }
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();

    const text = e.clipboardData.getData("text/plain");

    // Insert plain text at current cursor
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    // Move the cursor after the inserted text
    range.setStartAfter(textNode);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    // Update block content in state
    const blockRef = refs.current[index];
    if (blockRef) {
      updateBlock(index, blockRef.textContent);
    }
  };

  useEffect(() => {
    if (cursorInfo.current.blockIndex !== null) {
      const { blockIndex, position } = cursorInfo.current;
      const blockRef = refs.current[blockIndex];
      if (blockRef) {
        blockRef.focus();
        const selection = window.getSelection();
        const range = document.createRange();
        const textNode = blockRef.firstChild || blockRef;

        const pos = Math.min(position, textNode.textContent.length);

        range.setStart(textNode, pos);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
      }
      cursorInfo.current = {
        blockIndex: null,
        position: null
      };
    }
  }, [blocks]);

  return (
    <AppContainer>
      <Sidebar />
      <PageContainer
        title={title}
        setTitle={setTitle}
        blocks={blocks}
        updateBlock={updateBlock}
        handleKeyDown={handleKeyDown}
        handlePaste={handlePaste}
        refs={refs}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
      />
    </AppContainer>
  );
};

export default NoteTakingApp;
