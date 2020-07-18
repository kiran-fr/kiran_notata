import React from "react";
import { input_text, delete_link } from "./Form.module.css";

class InputNumeric extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || ''
    };
  }
  render() {
    
    let {
      value,
      onBlur,
      className,
      selectOnFocus,
      placeholder
    } = this.props;

    return (
      <input
        type="text"
        className={className || input_text}
        placeholder={placeholder || "Tap to type"}
        onChange={e => {
          let newValue = e.target.value;
          let regexp = /^[0-9]+$/;
          if (!regexp.test(newValue)) return;
          this.setState({value: newValue})
        }}
        onFocus={e => {
          this.setState({ placeholder: "" })
          if (selectOnFocus) {
            e.target.select()
          }
        }}
        onBlur={() => {
          this.setState({ placeholder: placeholder || "Tap to type" });
          onBlur(this.state.value)
        }}
        value={this.state.value}
      />
    );
  }
}

export default InputNumeric;
