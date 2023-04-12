import React from "react";
import { WithContext as ReactTags } from "react-tag-input";

const TagField = ({ tags, placeholder, onChange }) => {
  const handleTagDelete = (i) => {
    const newTags = tags.filter((tag, index) => index !== i);
    onChange(newTags);
  };

  const handleTagAddition = (tag) => {
    const newTags = [...tags, tag];
    onChange(newTags);
  };

  return (
    <ReactTags
      tags={tags}
      placeholder={placeholder}
      handleDelete={handleTagDelete}
      handleAddition={handleTagAddition}
      delimiterChars={["\t"]}
    />
  );
};
export default TagField;
