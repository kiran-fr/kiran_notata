import React from "react";
import classnames from "classnames";
import {
  page_header,
  progress_bars,
  progress_bar
} from "./PageHeader.module.css";
import { findIndex } from "lodash";

export class PageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTop: 0,
      currentIndex: 0,
      tops: []
    };
  }

  render() {
    let { d, dd } = this.props;
    let index = findIndex(dd, _d => _d.title === d.title);
    return (
      <div className={classnames(page_header, d.className)}>
        <h1>
          {d.title}
          <span style={{ opacity: 0.3 }}>
            {" "}
            - {this.props.name} - ({index + 1}/{dd.length})
          </span>
        </h1>
        <div className={progress_bars}>
          {d.questions.map((q, i) => (
            <div
              key={`q-${i}`}
              className={classnames(
                progress_bar,
                this.state.currentIndex === i + 1 ? d.className : "",
                this.state.currentIndex === 0 && i === 0 ? d.className : ""
              )}
            ></div>
          ))}
        </div>
      </div>
    );
  }
}
