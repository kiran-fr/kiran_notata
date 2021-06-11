import React, { useState, useEffect } from "react";

//styles
import styles from "./Dropdown.module.css";
import classnames from "classnames";

// Main function
export function Dropdown({ title, items = [], setSelected, setSelectedItem }) {
  // States
  const [isListOpen, setListOpen] = useState(false);
  const [name, setName] = useState("");

  const selectedOption = item => {
    setName(item.name);
    if (setSelected) {
      setSelected(item.id);
    }
    if (setSelectedItem) {
      setSelectedItem(item);
    }
    setListOpen(!isListOpen);
  };

  return (
    <div className={styles.dd_wrapper}>
      <div
        role="button"
        className={styles.dd_header}
        onClick={() => {
          setListOpen(!isListOpen);
        }}
      >
        <div className={styles.dd_header_title}>{name}</div>

        {isListOpen ? (
          <i className={classnames("fal fa-angle-up ", styles.i_icon)} />
        ) : (
          <i className={classnames("fal fa-angle-down", styles.i_icon)} />
        )}
      </div>

      {isListOpen && (
        <div role="list" className={styles.dd_list}>
          {items?.map(item => (
            <button
              className={
                item.name === name
                  ? styles.selected_bg + " " + styles.dd_list_item
                  : styles.dd_list_item
              }
              key={item.id}
              type="button"
              onClick={() => {
                selectedOption(item);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
