import React from "react";
import RadioButton from "../../ui-kits/radio-button";

export default function SingleChoiceInput({
  style,
  options,
  disabled,
  ...props
}) {
  return (
    <div style={style}>
      <form onSubmit={e => e.preventDefault()}>
        {options.map(({ val, checked, handleOnChange }, i) => {
          return (
            <div className="check_container" key={`o-${i}`}>
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
              {val}
            </div>
          );
        })}
      </form>
    </div>
  );
}
