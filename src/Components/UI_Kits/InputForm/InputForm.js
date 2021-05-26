import React, { useState, useEffect } from "react";
import styles from "./inputForm.module.css";
import classnames from "classnames";
import { getErrorMessage, storngPwd } from "./validation";

// Main function
export function InputForm({
  fullWidth,
  type,
  label,
  placeholder,
  name,
  required,
  position,
  setNextFlag,
  validate,
  reference,
  passwordConfirm,
  // Cus error message to be displayed to the right of field!
  errorMessage,
  handleInputChange,
  primaryPwdVal,
  disabled,
}) {
  // States
  const [error, setError] = useState(false);
  const [passFlag, setPassFlag] = useState(false);
  const [passStyle, setPassStyle] = useState(false);
  const [placeholderVal, setPlaceholderVal] = useState(
    placeholder || "Say something..."
  );

  const inputRef = reference;

  useEffect(() => {
    if (position && position === type) {
      setFocus();
    }
  }, [position, type]);

  useEffect(() => {
    if (validate) {
      // validateFormInput(inputRef.current.value);
    }
  }, [validate]);

  function setFocus() {
    // inputRef.current.focus();
  }

  // Blur function (form function)
  function handleBlur(e) {
    setPlaceholderVal(placeholder || "placeholder...");
    if (e.target.value === "") setPassStyle(false);
    validateFormInput(e.target.value);
  }

  // Change function (form function)
  function handleChange(e) {
    // passwordConfirm match testing

    if (handleInputChange) {
      handleInputChange(e.target.value, e.target.name);
    }

    validateFormInput(e.target.value);
    if (type === "password" && !passFlag) setPassStyle(true);
  }

  //KeyDown
  async function handleKeyDown(e) {
    if (e.keyCode === 13) {
      if (
        getErrorMessage({
          value: e.target.value || "",
          type,
          required,
          passwordConfirm,
        }) === false &&
        error === false
      )
        if (setNextFlag) {
          setNextFlag(type);
        } else validateFormInput(e.target.value);
    } else {
    }
  }

  function keyPress(e) {
    if (e.keyCode === 13) return true;
    const charCode = e.which ? e.which : e.keyCode;
    if (type === "number") {
      if (charCode <= 32 || charCode === 43 || (charCode > 47 && charCode < 58))
        return true;
      e.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  // Validate form input
  const validateFormInput = value => {
    // Check for error
    let errorMessage = getErrorMessage({
      value,
      type,
      required,
      passwordConfirm,
      primaryPwdVal,
    });

    // If error, set error message
    setError(errorMessage);
  };

  return (
    <div className={styles.container}>
      {error && type === "password" && !passwordConfirm && (
        <p className={true ? styles.inputError : styles.inputGrayError}>
          <i className="fa fa-exclamation-circle"></i>
          <span>{storngPwd}</span>
        </p>
      )}
      {label && <label className={styles.input_label}>{label}</label>}
      <div
        className={classnames(
          fullWidth ? styles.input_container : styles.inputDefaultWidth,
          styles.input_container,
          error && styles.redStyle,
          !passFlag && passStyle && styles.input_pass_div
        )}
      >
        <input
          type={
            passFlag || type === "email" || type === "number" || type === "url"
              ? "text"
              : type
          }
          className={classnames(
            styles.input_class,
            passStyle && styles.input_pass
          )}
          name={name}
          placeholder={placeholderVal}
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onKeyPress={keyPress}
          onFocus={() => setPlaceholderVal("")}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {type === "password" && (
          <i
            style={{ fontSize: "15px", color: "#c4c4c4" }}
            className={classnames(
              "fal",
              passFlag && "fa-eye-slash",
              !passFlag && "fa-eye"
            )}
            onClick={() => {
              setPassFlag(!passFlag);
            }}
          />
        )}
      </div>
      {(error || errorMessage) && (
        <p style={{ textTransform: "capitalize" }} className={styles.valError}>
          {errorMessage ? errorMessage : error}
        </p>
      )}
    </div>
  );
}
