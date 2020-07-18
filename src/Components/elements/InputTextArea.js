import React from "react";
import { text_area } from "./Form.module.css";

class InputTextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: this.props.placeholder || "Tap to type"
    };
  }
  render() {
    let { onChange, val, save } = this.props;
    return (
      <textarea
        onChange={e => onChange(e.target.value)}
        className={text_area}
        placeholder={this.state.placeholder}
        onFocus={() => this.setState({ placeholder: "" })}
        onBlur={() => {
          this.setState({
            placeholder: this.props.placeholder || "Tap to type"
          });
          save();
        }}
        value={val}
      />
    );
  }
}

export default InputTextArea;
