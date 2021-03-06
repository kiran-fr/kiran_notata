import React from "react";
import RadioButton from "../../../../Components/UI_Kits/from_srv/radio-button";
import styles from "./input.module.scss";

export default function SingleChoiceInput({
  style,
  options,
  disabled,
  ...props
}) {
  return (
    <>
      {options.map(({ val, checked, handleOnChange }, i) => {
        return (
          <div className={styles.radioButton} key={`o-${i}`}>
            {/* <label>
                <input
                  type="radio"
                  disabled={disabled}
                  checked={checked}
                  onChange={handleOnChange}
                />
                {val}
              </label> */}
            <RadioButton
              disabled={disabled}
              checked={checked}
              onChange={handleOnChange}
              {...props}
            />
            <span>{val}</span>
          </div>
        );
      })}
    </>
  );
}
