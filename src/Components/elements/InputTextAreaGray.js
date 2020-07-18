import React from "react";
import { text_area_gray } from "./Form.module.css";

class InputTextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: "Tap to type",
      value: this.props.val || ""
    };
  }
  render() {
    let { onChange, val, save } = this.props;
    return (
      <textarea
        onChange={e => this.setState({ value: e.target.value })}
        className={text_area_gray}
        placeholder={this.state.placeholder}
        onFocus={() => this.setState({ placeholder: "" })}
        onBlur={() => {
          this.setState({ placeholder: "Tap to type" });
          save(this.state.value);
        }}
        value={this.state.value}
      />
    );
  }
}

export default InputTextArea;
