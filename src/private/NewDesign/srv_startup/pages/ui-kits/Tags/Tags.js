import React, { useState, useEffect } from "react";
import TagsInput from "./TagsInput";
import { Tag } from "Components/elements";

//styles
import styles from "./Tag.module.css";
import classnames from "classnames";

//Tag buttons
function getTagButtons(tagButtons) {
  switch (tagButtons) {
    case "bigButtons":
      return styles.tagBigButton;
    case "smallButtons":
      return styles.tagSmallButton;
    default:
      return styles.tagBigButton;
  }
}
// Main function
export const Tags = ({
  size,
  tagSize,
  tagName,
  closeIcon,
  ulSize,
  getSelectedTag,
  setTags,
}) => {
  // States
  const [selectedTags, setSelectedTags] = useState([]);

  // console.log("items", items);
  // console.log("selectedTags", selectedTags);

  useEffect(() => {
    if (setTags) {
      let tags = [];
      setTags.forEach(el => {
        tags.push(el.toString());
      });
      setSelectedTags(tags);
    }
  }, [setTags]);

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
        />
      </div>
    </div>
  );
};
