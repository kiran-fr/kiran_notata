import React from "react";
import { input_text, delete_link } from "./Form.module.css";

class InputText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: "Tap to type"
    };
  }
  render() {
    let { onChange, val, save, deleteLink } = this.props;
    return (
      <div>
        <div className={delete_link} onClick={deleteLink}>
          delete
        </div>
        <input
          type="text"
          className={input_text}
          placeholder={this.state.placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => this.setState({ placeholder: "" })}
          onBlur={() => {
            this.setState({ placeholder: "Tap to type" });
            save();
          }}
          value={val}
        />
      </div>
    );
  }
}

export default InputText;
