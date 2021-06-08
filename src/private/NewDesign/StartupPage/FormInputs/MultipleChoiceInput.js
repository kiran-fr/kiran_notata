import React from "react";
import InputCheckBox from "../../srv_startup/pages/ui-kits/check-box";
import styles from "./input.module.scss";

export default function MultipleChoiceInput({
  style,
  options,
  disabled,
  ...props
}) {
  return (
    <>
      {options.map(({ val, key, checked, handleOnClick }) => {
        return (
          <div className={styles.checkbox} key={`o-${key}`}>
            <InputCheckBox
              className={styles.checkbox1}
              value={val}
              disabled={disabled}
              defaultChecked={checked}
              onClick={handleOnClick}
              {...props}
            />
            <span>{val}</span>
          </div>
        );
      })}
    </>
  );
}
