import React, { useState, useRef, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import PageContainer from "./PageContainer";
import { AppContainer, LoadingText } from "./styledComponents";
import {
  fetchPages,
  createPage,
  fetchPage,
  updatePage,
  deletePage,
  createBlock,
  updateBlock,
  deleteBlock,
  addTag,
  deleteTag,
  searchPagesByTags,
} from "./notesApi";

const DEBOUNCE_MS = 1500;

let _blockIdCounter = 1;
function tempBlockId() {
  return `new_${_blockIdCounter++}`;
}

const NoteTakingApp = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const pageIdFromUrl = pathname.startsWith('/notes/')
    ? parseInt(pathname.split('/')[2], 10) || null
    : null;

  const [pages, setPages] = useState([]);
  const [selectedId, setSelectedId] = useState(pageIdFromUrl);
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [filterTags, setFilterTags] = useState([]);
  const [filteredPages, setFilteredPages] = useState(null);

  const titleSaveTimer = useRef(null);
  const filterTimer = useRef(null);
  const blockSaveTimers = useRef({});
  const blocksRef = useRef(blocks);
  const cursorInfo = useRef({ blockIndex: null, position: null });
  const refs = useRef([]);

  blocksRef.current = blocks;

  // ── Sync selectedId from URL ─────────────────
  useEffect(() => {
    setSelectedId(pageIdFromUrl);
  }, [pathname]);

  // ── Load pages on mount ───────────────────────
  useEffect(() => {
    fetchPages()
      .then((data) => {
        setPages(data);
        if (data.length > 0 && !pageIdFromUrl) {
          setSelectedId(data[0].id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Fetch page when selected ──────────────────
  useEffect(() => {
    if (!selectedId) return;
    setPageLoading(true);
    fetchPage(selectedId)
      .then((data) => {
        setTitle(data.title);
        const mapped = (data.blocks || []).map((b) => ({
          _id: b.id,
          apiId: b.id,
          content: b.content,
        }));
        if (mapped.length === 0) {
          mapped.push({ _id: tempBlockId(), apiId: null, content: '' });
        }
        setBlocks(mapped);
        const tagNames = data.tags || [];
        const tagIds = data.tag_ids || [];
        setTags(tagNames.map((name, i) => ({ id: tagIds[i], name })));
        setPageLoading(false);
      })
      .catch(() => setPageLoading(false));
  }, [selectedId]);

  // ── Search by tags ─────────────────────────────
  useEffect(() => {
    if (filterTimer.current) clearTimeout(filterTimer.current);
    if (filterTags.length === 0) {
      setFilteredPages(null);
      return;
    }
    filterTimer.current = setTimeout(async () => {
      try {
        const result = await searchPagesByTags(filterTags);
        setFilteredPages(result);
      } catch {
        setFilteredPages(null);
      }
    }, 300);
  }, [filterTags]);

  // ── Auto-save title ───────────────────────────
  const scheduleTitleSave = useCallback((newTitle) => {
    if (titleSaveTimer.current) clearTimeout(titleSaveTimer.current);
    titleSaveTimer.current = setTimeout(() => {
      if (selectedId) {
        updatePage(selectedId, { title: newTitle });
      }
    }, DEBOUNCE_MS);
  }, [selectedId]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    setPages((prev) => prev.map((p) => p.id === selectedId ? { ...p, title: val } : p));
    scheduleTitleSave(val);
  };

  // ── Auto-save block ───────────────────────────
  const scheduleBlockSave = useCallback((blockId, content) => {
    if (blockSaveTimers.current[blockId]) {
      clearTimeout(blockSaveTimers.current[blockId]);
    }
    blockSaveTimers.current[blockId] = setTimeout(() => {
      const block = blocksRef.current.find((b) => b._id === blockId);
      if (!block) return;
      if (block.apiId) {
        updateBlock(block.apiId, { content });
      }
    }, DEBOUNCE_MS);
  }, []);

  const updateBlockContent = (index, value) => {
    setBlocks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], content: value };
      return next;
    });
    const blockId = blocksRef.current[index]?._id;
    if (blockId) scheduleBlockSave(blockId, value);
  };

  // ── Key handling (Enter, Backspace, arrows) ──
  const handleKeyDown = async (e, index) => {
    const block = blocksRef.current[index];
    if (!block) return;
    const textarea = e.currentTarget;
    const cursorPos = textarea.selectionStart;
    const currentText = block.content;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const before = currentText.slice(0, cursorPos);
      const after = currentText.slice(cursorPos);

      if (block.apiId) {
        await updateBlock(block.apiId, { content: before });
      }

      let newApiBlock = null;
      if (selectedId) {
        try {
          newApiBlock = await createBlock(selectedId, after, index + 1);
        } catch {}
      }

      const newBlock = {
        _id: newApiBlock ? newApiBlock.id : tempBlockId(),
        apiId: newApiBlock ? newApiBlock.id : null,
        content: after,
      };

      setBlocks((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], content: before };
        next.splice(index + 1, 0, newBlock);
        return next;
      });

      cursorInfo.current = { blockIndex: index + 1, position: 0 };
    } else if (e.key === "Backspace" && cursorPos === 0 && index > 0) {
      e.preventDefault();
      const prevBlock = blocksRef.current[index - 1];
      const merged = prevBlock.content + currentText;
      const newPos = prevBlock.content.length;

      if (block.apiId) {
        try { await deleteBlock(block.apiId); } catch {}
      }

      setBlocks((prev) => {
        const next = [...prev];
        next[index - 1] = { ...next[index - 1], content: merged };
        next.splice(index, 1);
        return next;
      });

      cursorInfo.current = { blockIndex: index - 1, position: newPos };
    } else if (e.key === "ArrowUp") {
      if (cursorPos === 0 && index > 0) {
        e.preventDefault();
        const prevLen = blocksRef.current[index - 1].content.length;
        cursorInfo.current = { blockIndex: index - 1, position: prevLen };
        setBlocks([...blocksRef.current]);
      }
    } else if (e.key === "ArrowDown") {
      if (cursorPos === currentText.length && index < blocksRef.current.length - 1) {
        e.preventDefault();
        cursorInfo.current = { blockIndex: index + 1, position: 0 };
        setBlocks([...blocksRef.current]);
      }
    }
  };

  // ── Restore cursor after re-render ─────────────
  useEffect(() => {
    if (cursorInfo.current.blockIndex !== null) {
      const { blockIndex, position } = cursorInfo.current;
      const textarea = refs.current[blockIndex];
      if (textarea) {
        textarea.focus();
        const pos = Math.min(position, textarea.value.length);
        textarea.setSelectionRange(pos, pos);
      }
      cursorInfo.current = { blockIndex: null, position: null };
    }
  }, [blocks]);

  // ── Tags ────────────────────────────────────────
  const handleAddTag = async (name) => {
    if (!selectedId) return;
    try {
      const newTag = await addTag(selectedId, name);
      setTags((prev) => [...prev, { id: newTag.id, name: newTag.name }]);
    } catch {}
  };

  const handleRemoveTag = async (tagId) => {
    try {
      await deleteTag(tagId);
      setTags((prev) => prev.filter((t) => t.id !== tagId));
    } catch {}
  };

  // ── Create new page ──────────────────────────
  const handleCreatePage = async () => {
    try {
      const newPage = await createPage("Untitled");
      setPages((prev) => [...prev, newPage]);
      history.push(`/notes/${newPage.id}`);
    } catch {}
  };

  const handleSelectPage = (id) => {
    history.push(`/notes/${id}`);
  };

  // ── Delete page ─────────────────────────────
  const handleDeletePage = async (pageId) => {
    try {
      await deletePage(pageId);
      setPages((prev) => {
        const remaining = prev.filter((p) => p.id !== pageId);
        if (selectedId !== pageId) return remaining;
        if (remaining.length > 0) {
          history.push(`/notes/${remaining[0].id}`);
        } else {
          history.push('/notes');
        }
        return remaining;
      });
    } catch {}
  };

  if (loading) return <LoadingText>Loading...</LoadingText>;

  return (
    <AppContainer>
      <Sidebar
        pages={filteredPages || pages}
        selectedId={selectedId}
        onSelect={handleSelectPage}
        onCreate={handleCreatePage}
        onDelete={handleDeletePage}
        filterTags={filterTags}
        onFilterChange={setFilterTags}
      />
      {selectedId ? (
        <PageContainer
          title={title}
          setTitle={handleTitleChange}
          blocks={blocks}
          updateBlock={updateBlockContent}
          handleKeyDown={handleKeyDown}
          refs={refs}
          pageLoading={pageLoading}
          tags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      ) : (
        <LoadingText>Select or create a page</LoadingText>
      )}
    </AppContainer>
  );
};

export default NoteTakingApp;
