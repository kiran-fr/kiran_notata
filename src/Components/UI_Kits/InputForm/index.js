import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

// Styles
import styles from "./inputForm.module.css";
import classnames from "classnames";

// Regex
import {
  email as reg_email,
  password as reg_pass,
  url as reg_url,
  number as reg_num,
} from "../../../utils/regex";

// Definitions
const EMAIL = "email";
const PASSWORD = "password";
const NUMBER = "number";
const URL = "url";
const REQUIRED = "required";

// Error message map
const errorMessage = {
  email: "email error",
  required: "required error",
  password: "password error",
  number: "number error",
  url: "url error",
};

// Get error functions
const getError = {
  email: str => {
    let isEmail = reg_email.test(String(str).toLocaleLowerCase());
    return isEmail ? false : errorMessage[EMAIL];
  },

  password: str => {
    let isPassword = reg_pass.test(str);
    return isPassword ? false : errorMessage[PASSWORD];
  },

  number: str => {
    let isNumber = reg_num.test(str);

    //    let isNumber = str.match(reg_num);
    return isNumber ? false : errorMessage[NUMBER];
  },

  url: str => {
    let isUrl = reg_url.test(str);
    return isUrl ? false : errorMessage[URL];
  },
};

// GET ERROR MESSAGE (if any)
function getErrorMessage({ value, inputType, required }) {
  // Validate required field
  if (required && value === "") {
    return errorMessage[REQUIRED];
  }

  // Validate the different input fields
  switch (inputType) {
    case EMAIL:
      return getError[EMAIL](value);

    case PASSWORD:
      return getError[PASSWORD](value);

    case NUMBER:
      return getError[NUMBER](value);

    case URL:
      return getError[URL](value);

    default:
      return false;
  }
}

// Main function
export function InputForm({
  inputType,
  label,
  placeholder,
  required,
  val,
  position,
  setNextFlag,
  validate,
  reference,
  // Cus error message to be displayed to the right of field!
  errorMessage,
}) {
  // States
  const [error, setError] = useState(false);
  const [passFlag, setPassFlag] = useState(false);
  const [passStyle, setPassStyle] = useState(false);
  const [placeholderVal, setPlaceholderVal] = useState(
    placeholder || "Say something..."
  );

  // Form
  const { handleSubmit, setValue } = useForm();
  const inputRef = useRef(null);

  useEffect(() => {
    val && setValue(inputType, val || "");
  }, [val, inputType, setValue]);

  useEffect(() => {
    console.log("use");
    if (position && position === inputType) {
      setFocus();
    }
  }, [position, inputType]);

  useEffect(() => {
    if (validate) {
      validateFormInput(inputRef.current.value);
    }
  }, [validate]);

  function setFocus() {
    inputRef.current.focus();
  }

  // Blur function (form function)
  function handleBlur(e) {
    setPlaceholderVal(placeholder || "placeholder...");
    if (e.target.value === "") setPassStyle(false);
    validateFormInput(e.target.value);
  }

  // Change function (form function)
  function handleChange(e) {
    if (inputType === "password" && !passFlag) setPassStyle(true);
    if (!error) return;
    validateFormInput(e.target.value);
  }

  //KeyDown
  async function handleKeyDown(e) {
    if (e.keyCode === 13) {
      if (
        getErrorMessage({
          value: e.target.value || "",
          inputType,
          required,
        }) === false &&
        error === false
      )
        setNextFlag(inputType);
      else validateFormInput(e.target.value);
    } else {
    }
  }

  function keyPress(e) {
    console.log("--- key donw");
    if (e.keyCode === 13) return true;
    const charCode = e.which ? e.which : e.keyCode;
    if (inputType === "number") {
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
    let errorMessage = getErrorMessage({ value, inputType, required });

    // If error, set error message
    setError(errorMessage);
  };

  return (
    <div className={styles.container}>
      {label && <label className={styles.input_label}>{label}</label>}
      <div
        className={classnames(
          styles.input_container,
          error && styles.redStyle,
          !passFlag && passStyle && styles.input_pass_div
        )}
      >
        <input
          type={
            passFlag ||
            inputType === "email" ||
            inputType === "number" ||
            inputType === "url"
              ? "text"
              : inputType
          }
          className={classnames(
            styles.input_class,
            passStyle && styles.input_pass
          )}
          name={inputType}
          placeholder={placeholderVal}
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onKeyPress={keyPress}
          onFocus={() => setPlaceholderVal("")}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {inputType === "password" && (
          <i
            className={classnames(
              "fal",
              passFlag && "fa-eye-slash",
              !passFlag && "fa-eye"
            )}
            style={{ color: "#c4c4c4" }}
            onClick={() => {
              setPassFlag(!passFlag);
            }}
          />
        )}
      </div>
      {error && inputType === "password" && (
        <p className={styles.inputError}>
          <i className="fa fa-exclamation-circle"></i>
          <span>
            Password must be between 8-20 characters with at least 1 alpha, 1
            numeric character and one special character from the list
            ‘@#$%^&+=!’. Passwords are case sensitive. Space are not allowed.
          </span>
        </p>
      )}
      {error && <p className={styles.valError}>{error}</p>}
    </div>
  );
}
