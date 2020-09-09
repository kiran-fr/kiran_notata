import React from "react";

export default function TextInput({
  rows,
  style,
  placeholder,
  disabled,
  defaultValue,
  onChange,
}) {
  return (
    <form onSubmit={e => e.preventDefault()} className="notata_form">
      <textarea
        rows={rows || 7}
        style={style}
        placeholder={placeholder}
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </form>
  );
}
