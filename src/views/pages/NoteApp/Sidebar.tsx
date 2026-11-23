import React, { useState } from "react";
import {
  SidebarContainer, SidebarHeader, SidebarPageItem,
  AddPageButton, SidebarTitle,
  TagInputWrapper, TagChip, TagRemove, TagInputField,
} from "./styledComponents";

const Sidebar = ({ pages, selectedId, onSelect, onCreate, onDelete, filterTags, onFilterChange }) => {
  const [input, setInput] = useState("");

  const addTag = (name) => {
    const t = name.trim().toLowerCase();
    if (t && !filterTags.includes(t)) {
      onFilterChange([...filterTags, t]);
    }
    setInput("");
  };

  const removeTag = (tag) => {
    onFilterChange(filterTags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && filterTags.length > 0) {
      removeTag(filterTags[filterTags.length - 1]);
    }
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>Pages</SidebarTitle>
        <AddPageButton onClick={onCreate}>+</AddPageButton>
      </SidebarHeader>
      <TagInputWrapper style={{ marginBottom: 8 }}>
        {filterTags.map((tag) => (
          <TagChip key={tag}>
            {tag}
            <TagRemove onClick={() => removeTag(tag)}>&times;</TagRemove>
          </TagChip>
        ))}
        <TagInputField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={filterTags.length === 0 ? "Filter by tag..." : ""}
        />
      </TagInputWrapper>
      {(pages || []).map((p) => (
        <SidebarPageItem
          key={p.id}
          $active={p.id === selectedId}
          onClick={() => onSelect(p.id)}
        >
          {p.title}
          <button
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: 0.5 }}
            onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
          >
            ×
          </button>
        </SidebarPageItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
