import React from "react";
// import { input_text, delete_link } from "./Form.module.css";

class InputText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: this.props.placeholder || "Tap to type",
      value: this.props.value || "",
      rows: 1,
      currentHeight: false,
    };
    this.dummyRef = React.createRef();
  }

  componentDidMount() {
    // Get current values
    let currentHeight = this.dummyRef.current.offsetHeight;
    let currentVal = this.dummyRef.current.innerHTML;

    // Calculate one row height
    this.dummyRef.current.innerHTML = "i";
    let oneLineHeight = this.dummyRef.current.offsetHeight;

    // Set value back to initial
    this.dummyRef.current.innerHTML = currentVal;

    // Calculate starting rows
    let rows = Math.ceil(currentHeight / oneLineHeight);

    this.setState({ currentHeight, rows });
  }

  render() {
    let { onBlur } = this.props;

    let placeholder = this.props.placeholder || "Tap to type";

    return (
      <div
        className={this.props.classNames || ""}
        style={{ position: "relative" }}
      >
        <textarea
          rows={this.state.rows}
          placeholder={this.state.placeholder}
          style={{ resize: "none" }}
          onChange={e => {
            this.setState({ value: e.target.value }, () => {
              let currentHeight = this.dummyRef.current.offsetHeight;

              // Add row
              if (currentHeight > this.state.currentHeight) {
                this.setState({ currentHeight, rows: (this.state.rows += 1) });
              }

              // Remove row
              if (currentHeight < this.state.currentHeight) {
                this.setState({ currentHeight, rows: (this.state.rows -= 1) });
              }
            });
          }}
          onFocus={() => this.setState({ placeholder: "" })}
          onBlur={() => {
            onBlur(this.state.value);
            this.setState({ placeholder });
          }}
          value={this.state.value}
        />

        <div
          ref={this.dummyRef}
          style={{
            padding: "2px",
            visibility: "hidden",
            position: "absolute",
            // color: 'red',
            // background: 'yellow',
            width: "100%",
          }}
        >
          {this.state.value}
        </div>
      </div>
    );
  }
}

export default InputText;
