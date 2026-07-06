import React, { useState } from "react";
import { TagChip, TagRemove, TagInputWrapper, TagInputField } from "./styledComponents";

const TagInput = ({ tags = [], onAdd, onRemove }) => {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && value.trim()) {
      e.preventDefault();
      onAdd(value.trim().toLowerCase());
      setValue("");
    } else if (e.key === "Backspace" && !value && tags.length > 0) {
      onRemove(tags[tags.length - 1].id);
    }
  };

  return (
    <TagInputWrapper>
      {tags.map((tag) => (
        <TagChip key={tag.id}>
          {tag.name}
          <TagRemove onClick={() => onRemove(tag.id)}>&times;</TagRemove>
        </TagChip>
      ))}
      <TagInputField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? "Add tag..." : ""}
      />
    </TagInputWrapper>
  );
};

export default TagInput;
