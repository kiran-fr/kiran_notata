import React from "react";
import "./multi-select.scss";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px dotted pink",
    color: state.isSelected ? "red" : "blue",
    padding: 20,
    fontFamily: "Proxima Nova",
    fontSize: "14px",
    lineHeight: "17px",
  }),
  control: () => ({
    // none of react-select's styles are passed to <Control />
    width: 200,
  }),
};
export default function MultiSelect({ options, placeholderLabel }) {
  return (
    <div className="react-multi-style">
      <ReactMultiSelectCheckboxes
        options={options}
        hideSearch={true}
        classNamePrefix="react-multi-style"
        placeholderButtonLabel={placeholderLabel}
      />
    </div>
  );
}
