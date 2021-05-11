import React, { useState } from "react";
import styles from "./CheckBox.module.css";

function CheckBox({ id, value, label, onSelect }) {
  return (
    <label className={styles.container}>
      <p>{label}</p>
      <input
        id={id}
        type="checkbox"
        value={value}
        // checked={isSelected}
        onChange={onSelect}
      />
      <span className={styles.checkmark} />
    </label>
  );
}

export function CheckBoxes({ data, getSelectedBox }) {
  const [selected, setSelected] = useState([]);

  const handleChange = e => {
    const isSelected = selected.includes(e.target.value);
    if (isSelected) {
      setSelected(
        selected.filter(value => {
          return value !== e.target.value;
        })
      );
      getSelectedBox(
        selected.filter(value => {
          return value !== e.target.value;
        })
      );
    } else {
      setSelected([e.target.value, ...selected]);
      getSelectedBox([e.target.value, ...selected]);
    }
  };

  return (
    <>
      {data.map((d, i) => (
        <CheckBox
          key={`${d.id}`}
          id={`${d.id}`}
          label={d.label}
          value={d.value}
          onSelect={handleChange}
        />
      ))}
    </>
  );
}
