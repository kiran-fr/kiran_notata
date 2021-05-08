import React, { useState, useEffect } from "react";
import styles from "./RadioButton.module.css";

function RadioButton({ id, value, label, isSelected, handleChange, name }) {
  return (
    <label className={styles.container}>
      <p>{label}</p>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={isSelected}
        onChange={handleChange}
      />
      <span className={styles.checkmark} />
    </label>
  );
}

export function RadioButtons({ name, data, getValue, setValue }) {
  const [checked, setChecked] = useState(data.length ? data[0].value : "");

  useEffect(() => {
    if (setValue) {
      setChecked(setValue.toLowerCase());
      if (getValue) {
        getValue(setValue.toLowerCase());
      }
    }
  }, [setValue]);

  function handleChange({ target }) {
    const { value } = target;
    if (getValue) {
      getValue(value);
    }
    setChecked(value);
  }

  return (
    <>
      {data.map((d, i) => (
        <RadioButton
          key={`${d.id}`}
          id={`${d.id}`}
          label={d.label}
          value={d.value}
          name={name}
          isSelected={checked === d.value}
          handleChange={handleChange}
        />
      ))}
    </>
  );
}
