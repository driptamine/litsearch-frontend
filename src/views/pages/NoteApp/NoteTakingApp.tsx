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
  updateBlockTable,
} from "./notesApi";
import { db, dbReady } from 'core/db/db';

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

async function upsertPages(table, apiItems, now) {
  const existing = await table.toArray();
  const map = new Map(existing.filter(e => e.apiId).map(e => [e.apiId, e]));
  const adds = [];
  const updates = [];
  for (const item of apiItems) {
    const rec = map.get(item.id);
    if (rec) {
      updates.push(table.update(rec.id, { ...item, tags: item.tags || [], tag_ids: item.tag_ids || [], apiId: item.id, updatedAt: now }));
    } else {
      adds.push({ ...item, tags: item.tags || [], tag_ids: item.tag_ids || [], apiId: item.id, createdAt: now, updatedAt: now });
    }
  }
  const toDelete = existing.filter(e => e.apiId && !apiItems.some(a => a.id === e.apiId));
  await Promise.all([
    ...updates,
    ...toDelete.map(e => table.delete(e.id)),
  ]);
  if (adds.length) await table.bulkAdd(adds);
}

  // ── Sync selectedId from URL ─────────────────
  useEffect(() => {
    setSelectedId(pageIdFromUrl);
  }, [pathname]);

  // ── Load pages on mount ───────────────────────
  useEffect(() => {
    (async () => {
      await dbReady;
      try {
        const cached = await db.pages.toArray();
        if (cached.length) {
          setPages(cached.map(p => ({ ...p, tags: p.tags || [], tag_ids: p.tag_ids || [] })));
        }
      } catch {}
      try {
        const data = await fetchPages();
        setPages(data);
        const now = new Date().toISOString();
        await upsertPages(db.pages, data, now);
        if (data.length > 0 && !pageIdFromUrl) {
          setSelectedId(data[0].id);
        }
      } catch {
        const cached = await db.pages.toArray();
        if (cached.length && !pageIdFromUrl) {
          setSelectedId(cached[0].apiId || cached[0].id);
        }
      }
      setLoading(false);
    })();
  }, []);

  function mapDbBlockToState(b) {
    return {
      dexieId: b.id,
      _id: b.apiId || b.id,
      apiId: b.apiId,
      type: b.type || 'text',
      content: b.content || '',
      tableData: b.type === 'table' ? b.tableData : null,
    };
  }

  // ── Fetch page when selected ──────────────────
  useEffect(() => {
    if (!selectedId) return;
    (async () => {
      await dbReady;
      let dexiePage, pageDexieId;
      try {
        dexiePage = await db.pages.where('apiId').equals(selectedId).first();
        if (!dexiePage) dexiePage = await db.pages.get(selectedId);
        if (dexiePage) {
          pageDexieId = dexiePage.id;
          setTitle(dexiePage.title || '');
          const cachedBlocks = await db.blocks.where('pageId').equals(dexiePage.id).sortBy('order');
          const mapped = cachedBlocks.length
            ? cachedBlocks.map(mapDbBlockToState)
            : [{ dexieId: null, _id: tempBlockId(), apiId: null, type: 'text', content: '' }];
          setBlocks(mapped);
        }
      } catch {}
      try {
        const data = await fetchPage(selectedId);
        setTitle(data.title === 'Untitled' ? '' : data.title);
        const now = new Date().toISOString();
        if (dexiePage) {
          await db.pages.update(dexiePage.id, { title: data.title === 'Untitled' ? '' : data.title, tags: data.tags || [], tag_ids: data.tag_ids || [], updatedAt: now });
        }
        const apiMapped = (data.blocks || []).map((b) => ({
          _id: b.id,
          apiId: b.id,
          type: b.type || 'text',
          content: b.content,
          tableData: b.type === 'table' ? b.table_data : null,
          dexieId: null,
        }));
        if (apiMapped.length === 0) {
          apiMapped.push({ dexieId: null, _id: tempBlockId(), apiId: null, type: 'text', content: '' });
        }
        setBlocks(apiMapped);
        try {
          if (pageDexieId) await db.blocks.where('pageId').equals(pageDexieId).delete();
          if (data.blocks?.length) {
            await db.blocks.bulkAdd(data.blocks.map(b => ({
              ...b,
              pageId: pageDexieId,
              apiId: b.id,
              content: b.content || '',
              type: b.type || 'text',
              tableData: b.type === 'table' ? b.table_data : null,
              order: b.order || 0,
              updatedAt: now, createdAt: now,
            })));
            const fresh = await db.blocks.where('pageId').equals(pageDexieId).sortBy('order');
            setBlocks(fresh.map(mapDbBlockToState));
          }
        } catch {}
        const tagNames = data.tags || [];
        const tagIds = data.tag_ids || [];
        setTags(tagNames.map((name, i) => ({ id: tagIds[i], name })));
      } catch {}
    })();
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
          updatePage(selectedId, { title: newTitle === 'Untitled' ? '' : newTitle });
      }
    }, DEBOUNCE_MS);
  }, [selectedId]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    setPages((prev) => prev.map((p) => p.id === selectedId ? { ...p, title: val } : p));
    if (selectedId) {
      dbReady.then(async () => {
        let p = await db.pages.where('apiId').equals(selectedId).first();
        if (!p) p = await db.pages.get(selectedId);
        if (p) await db.pages.update(p.id, { title: val, updatedAt: new Date().toISOString() });
      }).catch(() => {});
    }
    scheduleTitleSave(val);
  };

  // ── Auto-save block ───────────────────────────
  const scheduleBlockSave = useCallback((blockId, content) => {
    const block = blocksRef.current.find((b) => b._id === blockId);
    if (block) {
      dbReady.then(async () => {
        if (block.dexieId) {
          await db.blocks.update(block.dexieId, { content, updatedAt: new Date().toISOString() });
        } else if (block.apiId) {
          await db.blocks.where('apiId').equals(block.apiId).modify({ content, updatedAt: new Date().toISOString() });
        }
      }).catch(() => {});
    }
    if (blockSaveTimers.current[blockId]) {
      clearTimeout(blockSaveTimers.current[blockId]);
    }
    blockSaveTimers.current[blockId] = setTimeout(() => {
      const b = blocksRef.current.find((bl) => bl._id === blockId);
      if (!b) return;
      if (b.apiId) {
        updateBlock(b.apiId, { content }).catch(() => {});
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

  const pendingTableCreate = useRef({});

  const updateBlockTableData = (index, columns, rows) => {
    setBlocks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], tableData: { columns, rows } };
      return next;
    });
    const block = blocksRef.current[index];
    if (block) {
      dbReady.then(async () => {
        if (block.dexieId) {
          await db.blocks.update(block.dexieId, { tableData: { columns, rows }, updatedAt: new Date().toISOString() });
        } else if (block.apiId) {
          await db.blocks.where('apiId').equals(block.apiId).modify({ tableData: { columns, rows }, updatedAt: new Date().toISOString() });
        }
      }).catch(() => {});
    }
    if (block?.apiId) {
      updateBlockTable(block.apiId, columns, rows).catch(() => {});
    } else if (block?._id && selectedId && !pendingTableCreate.current[block._id]) {
      pendingTableCreate.current[block._id] = true;
      createBlock(selectedId, '', null, 'table', { columns, rows }).then((saved) => {
        pendingTableCreate.current[block._id] = false;
        const now = new Date().toISOString();
        db.blocks.add({ pageId: selectedId, apiId: saved.id, content: '', type: 'table', tableData: { columns, rows }, order: index, createdAt: now, updatedAt: now }).then((dexieId) => {
          setBlocks((prev) => prev.map((b) => b._id === block._id ? { ...b, apiId: saved.id, _id: saved.id, dexieId } : b));
        }).catch(() => {});
      }).catch(() => {
        pendingTableCreate.current[block._id] = false;
      });
    }
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
      const now = new Date().toISOString();

      if (block.dexieId) {
        await db.blocks.update(block.dexieId, { content: before, updatedAt: now });
      }

      let newApiBlock = null;
      let newDexieId = null;
      let newBlockState = null;
      if (selectedId) {
        try {
          newDexieId = await db.blocks.add({ pageId: selectedId, apiId: null, content: after, type: 'text', order: index + 1, createdAt: now, updatedAt: now });
        } catch {}
        try {
          newApiBlock = await createBlock(selectedId, after, index + 1);
        } catch {}
      }

      if (newDexieId && newApiBlock) {
        await db.blocks.update(newDexieId, { apiId: newApiBlock.id });
      }

      newBlockState = {
        dexieId: newDexieId,
        _id: newApiBlock?.id || (newDexieId || tempBlockId()),
        apiId: newApiBlock?.id || null,
        content: after,
      };

      setBlocks((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], content: before };
        next.splice(index + 1, 0, newBlockState);
        return next;
      });

      cursorInfo.current = { blockIndex: index + 1, position: 0 };
    } else if (e.key === "Backspace" && cursorPos === 0 && index > 0) {
      e.preventDefault();
      const prevBlock = blocksRef.current[index - 1];
      const merged = prevBlock.content + currentText;
      const newPos = prevBlock.content.length;

      if (block.dexieId) {
        await db.blocks.delete(block.dexieId);
      }

      if (prevBlock.dexieId) {
        await db.blocks.update(prevBlock.dexieId, { content: merged, updatedAt: new Date().toISOString() });
      }

      if (block.apiId) {
        deleteBlock(block.apiId).catch(() => {});
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
    await dbReady;
    try {
      const newTag = await addTag(selectedId, name);
      setTags((prev) => [...prev, { id: newTag.id, name: newTag.name }]);
      let page = await db.pages.where('apiId').equals(selectedId).first();
      if (!page) page = await db.pages.get(selectedId);
      if (page) {
        const tags = [...(page.tags || []), newTag.name];
        const tag_ids = [...(page.tag_ids || []), newTag.id];
        db.pages.update(page.id, { tags, tag_ids }).catch(() => {});
      }
    } catch {}
  };

  const handleRemoveTag = async (tagId) => {
    await dbReady;
    try {
      await deleteTag(tagId);
      setTags((prev) => prev.filter((t) => t.id !== tagId));
      let page = await db.pages.where('apiId').equals(selectedId).first();
      if (!page) page = await db.pages.get(selectedId);
      if (page) {
        const tagIdx = (page.tag_ids || []).indexOf(tagId);
        const tags = [...(page.tags || [])];
        const tag_ids = [...(page.tag_ids || [])];
        if (tagIdx >= 0) { tags.splice(tagIdx, 1); tag_ids.splice(tagIdx, 1); }
        db.pages.update(page.id, { tags, tag_ids }).catch(() => {});
      }
    } catch {}
  };

  // ── Create new page ──────────────────────────
  const handleCreatePage = async () => {
    await dbReady;
    const now = new Date().toISOString();
    try {
      const newPage = await createPage("");
      newPage.title = "";
      setPages((prev) => [...prev, newPage]);
      await db.pages.add({ ...newPage, tags: newPage.tags || [], tag_ids: newPage.tag_ids || [], apiId: newPage.id, createdAt: now, updatedAt: now });
      history.push(`/notes/${newPage.id}`);
    } catch {
      const dexieId = await db.pages.add({ title: '', apiId: null, tags: [], tag_ids: [], createdAt: now, updatedAt: now });
      const localPage = { id: dexieId, title: '', tags: [], tag_ids: [] };
      setPages((prev) => [...prev, localPage]);
      history.push(`/notes/${dexieId}`);
    }
    // Ensure at least one empty block exists in Dexie for the new page
    const targetId = await db.pages.toCollection().last();
    if (targetId) {
      const existingBlocks = await db.blocks.where('pageId').equals(targetId.id).count();
      if (existingBlocks === 0) {
        const bId = await db.blocks.add({ pageId: targetId.id, apiId: null, content: '', type: 'text', order: 0, createdAt: now, updatedAt: now });
        setBlocks([{ dexieId: bId, _id: bId, apiId: null, type: 'text', content: '' }]);
      }
    }
  };

  const handleSelectPage = (id) => {
    history.push(`/notes/${id}`);
  };

  // ── Delete page ─────────────────────────────
  const handleInsertTable = useCallback(() => {
    const defaultTable = { columns: ["Column 1", "Column 2"], rows: [["", ""]] };
    const now = new Date().toISOString();
    let dexieId = null;
    const order = blocks.length;
    const tempId = tempBlockId();
    if (selectedId) {
      db.blocks.add({ pageId: selectedId, apiId: null, content: '', type: 'table', tableData: defaultTable, order, createdAt: now, updatedAt: now }).then((id) => { dexieId = id; }).catch(() => {});
    }
    const newBlock = { dexieId: null, _id: tempId, apiId: null, type: 'table', content: '', tableData: defaultTable };
    setBlocks((prev) => [...prev, newBlock]);
    if (selectedId) {
      createBlock(selectedId, '', null, 'table', defaultTable).then((saved) => {
        const savedId = saved.id;
        db.blocks.where('pageId').equals(selectedId).filter(b => b.apiId === null).last().then(rec => {
          if (rec) db.blocks.update(rec.id, { apiId: savedId }).then(() => {
            setBlocks((prev) => prev.map((b) => b._id === tempId ? { ...b, apiId: savedId, _id: savedId, dexieId: rec.id } : b));
          });
        }).catch(() => {});
      }).catch(() => {});
    }
  }, [selectedId, blocks.length]);

  const handleInsertTableAt = useCallback((afterIndex) => {
    const defaultTable = { columns: ["Column 1", "Column 2"], rows: [["", ""]] };
    const now = new Date().toISOString();
    const tempId = tempBlockId();
    if (selectedId) {
      db.blocks.add({ pageId: selectedId, apiId: null, content: '', type: 'table', tableData: defaultTable, order: afterIndex + 1, createdAt: now, updatedAt: now }).catch(() => {});
    }
    const newBlock = { dexieId: null, _id: tempId, apiId: null, type: 'table', content: '', tableData: defaultTable };
    setBlocks((prev) => {
      const next = [...prev];
      next.splice(afterIndex + 1, 0, newBlock);
      return next;
    });
    if (selectedId) {
      createBlock(selectedId, '', afterIndex + 1, 'table', defaultTable).then((saved) => {
        db.blocks.where('pageId').equals(selectedId).filter(b => b.apiId === null).last().then(rec => {
          if (rec) db.blocks.update(rec.id, { apiId: saved.id }).then(() => {
            setBlocks((prev) => prev.map((b) => b._id === tempId ? { ...b, apiId: saved.id, _id: saved.id, dexieId: rec.id } : b));
          });
        }).catch(() => {});
      }).catch(() => {});
    }
  }, [selectedId]);

  const handleDeletePage = async (pageId) => {
    await dbReady;
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
    try {
      let page = await db.pages.where('apiId').equals(pageId).first();
      if (!page) page = await db.pages.get(pageId);
      if (page) {
        await db.blocks.where('pageId').equals(page.id).delete();
        await db.pages.delete(page.id);
      }
    } catch {}
    try {
      await deletePage(pageId);
    } catch {}
  };

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
          tags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onInsertTable={handleInsertTable}
          onTableChange={updateBlockTableData}
          onInsertTableAt={handleInsertTableAt}
        />
      ) : (
        <LoadingText>Select or create a page</LoadingText>
      )}
    </AppContainer>
  );
};

export default NoteTakingApp;
