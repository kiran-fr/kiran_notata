import React, { useState, useEffect } from "react";
import "./drop-down.scss";

// Main function
export default function Dropdown({
  title,
  items = [],
  setSelected,
  setSelectedItem,
}) {
  // States
  const [isListOpen, setListOpen] = useState(false);
  const [name, setName] = useState("");

  const selectedOption = item => {
    setName(item.name);

    if (setSelected) {
      setSelected(item.id);
      // setName(item.name);
    }

    if (setSelectedItem) {
      setSelectedItem(item);
    }
    setListOpen(!isListOpen);
  };

  return (
    <div className="dd_wrapper">
      <div
        role="button"
        className="dd_header"
        onClick={() => {
          setListOpen(!isListOpen);
        }}
      >
        <div className="dd_header_title">{name}</div>

        {isListOpen ? (
          <i className={"fal fa-angle-up"} />
        ) : (
          <i className={"fal fa-angle-down"} />
        )}
      </div>

      {isListOpen && (
        <div role="list" className="dd_list">
          {items.map(item => (
            <div
              className="dd_list_item"
              key={item.id}
              /*  active={i === cursor}
              item={item}
              setSelected={setSelected}
              setHovered={setHovered} */
              type="button"
              onClick={() => {
                selectedOption(item);
              }}
            >
              <span>{item.name}</span>
              {item.template && item.template}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
