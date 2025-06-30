import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import PageContainer from "./PageContainer";
import  { AppContainer }  from "./styledComponents";

const NoteTakingApp = () => {
  const [title, setTitle] = useState("New page");
  const [blocks, setBlocks] = useState([""]);
  const refs = useRef([]);
  const cursorInfo = useRef({ blockIndex: null, position: null });
  const [focusedIndex, setFocusedIndex] = useState(null);

  const updateBlock = (index, value) => {
    const newBlocks = [...blocks];
    newBlocks[index] = value;
    setBlocks(newBlocks);
  };

  const handleKeyDown = (e, index) => {
    const cursorPos = e.target.selectionStart;
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
      cursorInfo.current = { blockIndex: index - 1, position: previousBlock.length };
    } else if (e.key === "ArrowUp") {
      if (cursorPos === 0 && index > 0) {
        e.preventDefault();
        const prevBlock = blocks[index - 1];
        cursorInfo.current = { blockIndex: index - 1, position: prevBlock.length };
        setTimeout(() => setBlocks([...blocks]), 0);
      }
    } else if (e.key === "ArrowDown") {
      if (cursorPos === currentText.length && index < blocks.length - 1) {
        e.preventDefault();
        cursorInfo.current = { blockIndex: index + 1, position: 0 };
        setTimeout(() => setBlocks([...blocks]), 0);
      }
    }
  };

  useEffect(() => {
    if (cursorInfo.current.blockIndex !== null) {
      const { blockIndex, position } = cursorInfo.current;
      const blockRef = refs.current[blockIndex];
      if (blockRef) {
        blockRef.focus();
        blockRef.setSelectionRange(position, position);
      }
      cursorInfo.current = { blockIndex: null, position: null };
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
        refs={refs}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
      />
    </AppContainer>
  );
};

export default NoteTakingApp;
