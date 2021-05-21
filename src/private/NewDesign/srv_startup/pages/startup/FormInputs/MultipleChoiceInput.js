import React from "react";
import InputCheckBox from "../../ui-kits/check-box";

export default function MultipleChoiceInput({
  style,
  options,
  disabled,
  ...props
}) {
  return (
    <div style={style}>
      <form onSubmit={e => e.preventDefault()}>
        {options.map(({ val, key, checked, handleOnClick }) => {
          return (
            <div className="check_container" key={`o-${key}`}>
              {/* <label>
               <input
                  type="checkbox"
                  value={val}
                  disabled={disabled}
                  defaultChecked={checked}
                  onClick={handleOnClick}
                />
                {val}
              </label> */}

              <InputCheckBox
                value={val}
                disabled={disabled}
                defaultChecked={checked}
                onClick={handleOnClick}
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
