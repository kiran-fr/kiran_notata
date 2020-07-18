import "date-fns";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { TextField, InputAdornment } from "@material-ui/core";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import {
  fade,
  ThemeProvider,
  withStyles,
  makeStyles,
  createMuiTheme
} from "@material-ui/core/styles";

import { input_class } from "./Date.module.css";

const CssTextField = withStyles({
  root: {
    "& input": {
      padding: "12px 0px 10px 14px",
      fontWeight: 300
    },
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: "0px"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#999"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#999",
        borderRadius: "0px"
      },
      "&:hover fieldset": {
        borderColor: "#999"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#999",
        border: "1px solid"
      }
    }
  }
})(TextField);

const CustomInput = props => {
  return (
    <CssTextField
      {...props}
      style={{ margin: "3px", width: "160px" }}
      variant="outlined"
      id="custom-css-outlined-input"
    />
  );
};

const DatePicker = ({ date, label, setNewDate }) => {
  const [selectedDate, setSelectedDate] = React.useState(
    new Date(date || "2014-08-18T21:11:54")
  );

  const handleDateChange = date => {
    setSelectedDate(date);
    setNewDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="dd/MM/yyyy"
        margin="normal"
        id="date-picker-from"
        label={label || "Label"}
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date"
        }}
        TextFieldComponent={CustomInput}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePicker;
