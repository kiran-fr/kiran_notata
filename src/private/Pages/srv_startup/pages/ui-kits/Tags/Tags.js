import React, { useState, useEffect } from "react";

//styles
import styles from "./Tag.module.css";

// Main function
export const Tags = ({ onchange }) =>
  // {
  // size,
  // tagSize,
  // tagName,
  // closeIcon,
  // ulSize,
  // getSelectedTag,
  // setTags,
  // removeTag,
  // }
  {
    // States
    // const [selectedTags, setSelectedTags] = useState([]);
    const [value, setValue] = useState("");

    // useEffect(() => {
    //   if (setTags) {
    //     let tags = [];
    //     setTags.forEach(el => {
    //       tags.push({
    //         id: el.id,
    //         name: el.name,
    //         type: el.group.name,
    //       });
    //     });
    //     setSelectedTags(tags);
    //   }
    // }, [setTags]);
    // console.log(selectedTags);
    // // Select tags
    // function selectTags(tags) {
    //   setSelectedTags(tags);
    //   if (getSelectedTag) {
    //     getSelectedTag(tags);
    //   }
    // }

    // New Functionality

    return (
      <div className={styles.tag_wrapper}>
        <div>
          <input
            value={value}
            onChange={e => {
              setValue(e.target.value);
              onchange(e.target.value);
            }}
            className={styles.tagInput}
          ></input>
        </div>
      </div>
    );
  };
