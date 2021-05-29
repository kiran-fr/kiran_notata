import React, { useState, useEffect } from "react";
import TagsInput from "./TagsInput";

//styles
import styles from "./Tag.module.css";

// Main function
export const Tags = ({
  size,
  tagSize,
  tagName,
  closeIcon,
  ulSize,
  getSelectedTag,
  setTags,
  removeTag,
}) => {
  // States
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (setTags) {
      let tags = [];
      setTags.forEach(el => {
        tags.push({
          id: el.id,
          name: el.name,
          type: el.group.name,
        });
      });
      setSelectedTags(tags);
    }
  }, [setTags]);
  console.log(selectedTags);
  // Select tags
  function selectTags(tags) {
    setSelectedTags(tags);
    if (getSelectedTag) {
      getSelectedTag(tags);
    }
  }

  return (
    <div className={styles.tag_wrapper}>
      <div>
        <TagsInput
          selectTags={selectTags}
          selectedTags={selectedTags}
          size={size}
          tagSize={tagSize}
          tagName={tagName}
          closeIcon={closeIcon}
          ulSize={ulSize}
          removeTag={removeTag}
        />
      </div>
    </div>
  );
};
