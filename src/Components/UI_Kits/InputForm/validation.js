// Regex
import {
  email as reg_email,
  password as reg_pass,
  url as reg_url,
  number as reg_num,
} from "../../../utils/regex";

// storngPwd

export const storngPwd = `Password must be between 8-20 characters with at least 1 alpha, 1
numeric character and one special character from the list
‘@#$%^&+=!’. Passwords are case sensitive. Space are not allowed.`;

// Definitions
const EMAIL = "email";
const PASSWORD = "password";
const NUMBER = "number";
const URL = "url";
const REQUIRED = "required";
const CONFIRMPASSWORD = "confirmPassword";
const MATCH = "match";

// Error message map
const errorMessage = {
  email: "Please enter a valid email",
  required: "Can't be Blank",
  password: "password error",
  number: "number error",
  url: "url error",
  match: "Passwords Do Not Match",
};

// Get error functions
const getError = {
  email: str => {
    let isEmail = reg_email.test(String(str).toLocaleLowerCase());
    return isEmail ? false : errorMessage[EMAIL];
  },

  password: str => {
    return false;
    // let isPassword = reg_pass.test(str);
    // return isPassword ? false : errorMessage[PASSWORD];
  },

  confirmPassword: (str, primaryPwd) => {
    // let isPassword = reg_pass.test(str);
    let Pwdmatching = primaryPwd === str;
    return Pwdmatching ? false : errorMessage[MATCH];
    // return isPassword && Pwdmatching ? false : errorMessage[MATCH];
  },

  number: str => {
    let isNumber = reg_num.test(str);
    return !isNumber ? false : errorMessage[NUMBER];
  },

  url: str => {
    let isUrl = reg_url.test(str);
    return isUrl ? false : errorMessage[URL];
  },
};

// GET ERROR MESSAGE (if any)
export function getErrorMessage({
  value,
  type,
  required,
  passwordConfirm,
  primaryPwdVal,
}) {
  // Validate required field
  if (required && value === "") {
    return type + " " + errorMessage[REQUIRED];
  }
  if (passwordConfirm) {
    return getError[CONFIRMPASSWORD](value, primaryPwdVal);
  }
  // Validate the different input fields
  switch (type) {
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
