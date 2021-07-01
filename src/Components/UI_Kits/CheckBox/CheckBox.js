import React, { useEffect, useState } from "react";
import styles from "./CheckBox.module.css";

export function CheckBox({ id, value, label, onSelect, isSelected }) {
  return (
    <label className={styles.container}>
      <p>{label}</p>
      <input
        id={id}
        type="checkbox"
        value={value}
        checked={isSelected}
        onChange={onSelect}
        autoComplete="off"
      />
      <span className={styles.checkmark} />
    </label>
  );
}

export function CheckBoxes({ data, getSelectedBox }) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (data) {
      let checkedBoxes = data.filter(({ checked }) => checked);
      setSelected(checkedBoxes.map(({ value }) => value));
    }
  }, [data]);

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
    }

    if (!isSelected) {
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
          isSelected={d.checked}
          onSelect={handleChange}
        />
      ))}
    </>
  );
}
