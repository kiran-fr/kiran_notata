import React from "react";
import { Tag } from "Components/elements";

//styles
import styles from "./Tag.module.css";
import classnames from "classnames";

//input size
function getInputSize(size) {
  switch (size) {
    case "bigInput":
      return styles.bigInput;
    case "smallInput":
      return styles.smallInput;
    default:
      return styles.bigInput;
  }
}

//Tag size
function getTagSize(tagSize) {
  switch (tagSize) {
    case "bigTagSize":
      return styles.bigTag;
    case "smallTagSize":
      return styles.smallTag;
    default:
      return styles.bigTag;
  }
}
//Tag size
function getTagName(tagName) {
  switch (tagName) {
    case "bigTagName":
      return styles.bigTagName;
    case "smallTagName":
      return styles.smallTagName;
    default:
      return styles.bigTagName;
  }
}
//Tag size
function getCloseIcon(closeIcon) {
  switch (closeIcon) {
    case "bigCloseIcon":
      return styles.tag_bigClose_icon;
    case "smallCloseIcon":
      return styles.tag_smallClose_icon;
    default:
      return styles.tag_bigClose_icon;
  }
}
//Tag size
function getULSize(ulSize) {
  switch (ulSize) {
    case "bigULSize":
      return styles.bigTagUL;
    case "smallULSize":
      return styles.smallTagUL;
    default:
      return styles.bigTagUL;
  }
}
//Main function
export default function TagsInput({
  selectTags,
  selectedTags,
  size,
  tagSize,
  tagName,
  closeIcon,
  ulSize,
}) {
  //remove tag
  function removeTagByname(index) {
    let newTags = selectedTags.filter(i => i !== index);
    selectTags(newTags);
  }

  //Add tag
  function addTags(e) {
    if (e.target.value === "") {
      return;
    }
    const newTag = `${e.target.value.split(",")[0]}`;

    let newTags = [...selectedTags, newTag];
    selectTags(newTags);
    e.target.value = "";
  }

  function handleUserEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTags(e);
    } else {
      return null;
    }
  }

  return (
    <Tag
      className={classnames(getInputSize(size))}
      style={{ display: "flex", flexWrap: "wrap" }}
    >
      <ul className={classnames(getULSize(ulSize))}>
        {selectedTags.map((tag, index) => (
          <li key={index} className={classnames(getTagSize(tagSize))}>
            {console.log("TAG: ", tag)}
            <span className={classnames(getTagName(tagName))}>{tag}</span>

            <span
              className={classnames(getCloseIcon(closeIcon))}
              onClick={() => removeTagByname(tag)}
            >
              <i className={"fal fa-times"} />
            </span>
          </li>
        ))}
        <div className={styles.tag_inputt}>
          <input
            style={{
              marginTop: selectedTags.length > 0 ? "3px" : "2px",
              width: "100px",
            }}
            onKeyPress={handleUserEnter}
          />
        </div>
      </ul>
    </Tag>
  );
}
